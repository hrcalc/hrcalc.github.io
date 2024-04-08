<template>
  <v-container>
    <v-responsive class="align-center" min-width="1024">
      <v-row>
        <v-col cols="4">
          <h4>Tax calculator Spain</h4>
          <v-select v-model="year"
            :items="[2024, 2025]"
            label="Second Year"></v-select>
          <v-text-field label="Gross Salary" v-model.number="gross_salary" type="number" hide-details
            prefix="€"></v-text-field>
          <v-list density="compact">
            <v-list-item>
              <v-list-item-title class="font-weight-bold">Taxable income calculation</v-list-item-title>
            </v-list-item>
            <v-list-item title="Base salary after registration Individual Entrepreneur/ Autonomo">
              <template v-slot:append>€ {{ base_salary_after_registration }}</template>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col>
          <div>The first thing to understand is the income tax and social security contributions in Spain, which are individualized and depend on the annual salary, including compensations and bonuses, marital status, the presence of children, and expenses that can reduce the taxable base.
Our corporate accountants, known as "gestors" in Spain, can assist you with calculating personal social charges and taxes. Here, we will describe the general principles of tax calculation in Spain, taking into account standard or minimum tax rates and standard exemptions.</div>
          <v-table density="compact">
            <thead>
              <tr>
                <th class="text-left">Year</th>
                <th class="text-left">Base Salary</th>
                <th class="text-left">Social Plata</th>
                <th class="text-left">Annual income</th>
                <th class="text-left">Social Charges</th>                
                <th class="text-left">Income Еax </th>
                <th class="text-left">Net Salary</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in rows" :key="item.num">
                <td class="text-left">{{ item.num }}</td>
                <td class="text-left">€ {{ item.gross_salary }}</td>
                <td class="text-left">€ {{ item.social }}</td>
                <td class="text-left">€ {{ item.annual_income }}</td>
                <td class="text-left">€ {{ item.social_real }}</td>                
                <td class="text-left">€ {{ item.tax }}</td>
                <td class="text-left">€ {{ item.net_salary }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <div>Tax calculation first year</div>
          <v-table density="compact">
            <thead>
              <tr>
                <th class="text-left">Range</th>
                <th class="text-left">Money</th>
                <th class="text-left">Tax</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in rows[0].tax_results" :key="item.min">
                <td class="text-left">{{ item.min }} - {{ item.max }}</td>
                <td class="text-left">€ {{ item.t }}</td>
                <td class="text-left">€ {{ item.tax }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
        <v-col cols="6">
          <div>Tax calculation second year</div>
          <v-table density="compact">
            <thead>
              <tr>
                <th class="text-left">Range</th>
                <th class="text-left">Money</th>
                <th class="text-left">Tax</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in rows[1].tax_results" :key="item.min">
                <td class="text-left">{{ item.min }} - {{ item.max }}</td>
                <td class="text-left">€ {{ item.t }}</td>
                <td class="text-left">€ {{ item.tax }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>
<script setup lang="ts">
let gross_salary = $ref(3600)

const rnd = (f: number) => Math.round((f + Number.EPSILON) * 100) / 100
let year = $ref(new Date().getFullYear())

const first_year_monthly_social_charges = $ref(80)
const base_salary_after_registration = $computed(() => rnd(gross_salary * 1.1))
const next_year_monthly_social_charges: Record<number, Function> = {
  2024: (base_amount: number) => {
    let amount = base_amount * 0.93
    if(amount < 3620) return 1241.83*0.313
    if(amount < 4050) return 1307.19*0.313
    if(amount < 6000) return 1454.25*0.313
    return 1732.03*0.313
  },
  2025: (base_amount: number) => {
    let amount = base_amount * 0.93
    if(amount < 3620) return 1519.61*0.313
    if(amount < 4050) return 1601.31*0.313
    if(amount < 6000) return 1732.03*0.313
    return 1928.10*0.313
  }
}

const tax_ranges = [
  { min: 0, max: 12450, percent: 0.19 },
  { min: 12450, max: 20200, percent: 0.24 },
  { min: 20200, max: 35200, percent: 0.3 },
  { min: 35200, max: 60000, percent: 0.37 },
  { min: 60000, max: 300000, percent: 0.45 },
]
const years = [
  1,2
]
const rows = $computed(() => {
  return years.map(item => {
    let social_plata = item == 1 ? first_year_monthly_social_charges: rnd(next_year_monthly_social_charges[year](base_salary_after_registration))
    let social_real = item == 1 ? first_year_monthly_social_charges: rnd(next_year_monthly_social_charges[year](base_salary_after_registration + social_plata))
    let annual_income = rnd((base_salary_after_registration + social_plata) * 12)
    let taxable_income = rnd(annual_income - social_real*12)
    let taxable_income2 = Number(taxable_income)
    let added = 0
    let tax_results = []
    for (let range of tax_ranges) {
      if (taxable_income2 > range.min) {
        let t = Math.min(taxable_income2 - added, range.max - range.min)
        added += t
        tax_results.push({ ...range, t: rnd(t), tax: rnd(t * range.percent) })
      } else {
        tax_results.push({ ...range, t: 0, tax: 0 })
      }
    }
    let tax = rnd(tax_results.reduce((a, v) => a + v.tax, 0) / 12)
    let net_salary = rnd(base_salary_after_registration + social_plata - tax - social_real)
    return {
      num: item,
      gross_salary: base_salary_after_registration,
      social: social_plata,
      social_real: social_real,
      annual_income: annual_income,
      taxable_income: taxable_income,
      tax: tax,
      net_salary: net_salary,
      tax_results: tax_results
    }
  })
})
</script>