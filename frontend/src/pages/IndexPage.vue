<template>
  <v-container>
    <v-responsive class="align-center" min-width="1024">
      <v-row>
        <v-col cols="4">
          <h4>Tax calculator Cyprus</h4>
          <v-select v-model="year"
            :items="[2023, 2024]"
            label="Year"></v-select>
          <v-text-field label="Gross Salary" v-model.number="gross_salary" type="number" hide-details
            prefix="€"></v-text-field>
          <v-text-field label="Net Salary (€)" v-model="net_salary_expected" type="number" hide-details
            append-inner-icon="mdi-calculator" @click:append-inner="calculate"></v-text-field>
          <!-- <v-checkbox label="Expatriate relief" v-model="expatriate_relief" hide-details></v-checkbox> -->
          <v-select v-model="expatriate_relief"
            :items="[{ title: 'Expatriate relief 50%', value: 0.5 }, { title: 'Expatriate relief 20%', value: 0.2 }, { title: 'No relief', value: 0 }]"
            label="Expatriate relief"></v-select>
          <v-text-field label="Donations" v-model.number="donations" type="number" hide-details
            prefix="€"></v-text-field>
          <v-list density="compact">
            <v-list-item>
              <v-list-item-title class="font-weight-bold">Taxable income calculation</v-list-item-title>
            </v-list-item>
            <v-list-item title="Taxable source of income">
              <template v-slot:append>€ {{ taxable_source_of_income }}</template>
            </v-list-item>
            <v-list-item title="Expatriate relief">
              <template v-slot:append>€ {{ expatriate_relief_value }}</template>
            </v-list-item>
            <v-list-item title="Donations">
              <template v-slot:append>€ {{ donations }}</template>
            </v-list-item>
            <v-list-item title="Net income">
              <template v-slot:append>€ {{ net_income }}</template>
            </v-list-item>
            <v-list-item title="1/5 allowances">
              <template v-slot:append>€ {{ personal_allowances }}</template>
            </v-list-item>
            <v-list-item title="Social insurance contributions">
              <template v-slot:append>€ {{ social_insurance_contributions }}</template>
            </v-list-item>
            <v-list-item title="Taxable income">
              <template v-slot:append>€ {{ taxable_income }}</template>
            </v-list-item>
          </v-list>
          <v-table density="compact">
            <thead>
              <tr>
                <th class="text-left">Range</th>
                <th class="text-left">Money</th>
                <th class="text-left">Tax</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in tax_calculated" :key="item.min">
                <td class="text-left">{{ item.min }} - {{ item.max }}</td>
                <td class="text-left">€ {{ item.t }}</td>
                <td class="text-left">€ {{ item.tax }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-list density="compact">
            <v-list-item title="Annual tax payable">
              <template v-slot:append>€ {{ annual_tax_payable }}</template>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col>
          <v-table density="compact">
            <thead>
              <tr>
                <th class="text-left">Month</th>
                <th class="text-left">Gross Salary</th>
                <th class="text-left">Bonus</th>
                <th class="text-left">
                  NHS SI
                  <v-tooltip activator="parent" location="top center">{{ nhs_si_percent * 100 }} %</v-tooltip>
                </th>
                <th class="text-left">SI
                  <v-tooltip activator="parent" location="top center">{{ si_percent[year] * 100 }} %</v-tooltip>
                </th>
                <th class="text-left">Tax</th>
                <th class="text-left">Net Salary</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in rows" :key="item.month">
                <td class="text-left">{{ item.month }}</td>
                <td class="text-left">€ {{ item.gross_salary }}</td>
                <td class="text-left">€ {{ item.bonus }}</td>
                <td class="text-left">€ {{ item.nhs_si }}</td>
                <td class="text-left">€ {{ item.si }}</td>
                <td class="text-left">€ {{ item.tax }}</td>
                <td class="text-left">€ {{ item.net_salary }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>
<script setup lang="ts">
import { watch } from 'vue';
let gross_salary = $ref(3000)
let net_salary_expected = $ref(0)
let expatriate_relief = $ref(0.5)
let bonus = $ref(0)
let hf = $ref(0)
let donations = $ref(0)
let restrictions_of_ci: Record<number, number> = {
  2023: 5005,
  2024: 5239
}
const rnd = (f: number) => Math.round((f + Number.EPSILON) * 100) / 100
let year = $ref(new Date().getFullYear())
const restrictions_of_gesy = $ref(180000)
const nhs_si_percent = $ref(0.0265)
const si_percent: Record<number, number> = {
  2023: 0.083,
  2024: 0.088
}
watch($$(gross_salary), (newSalary) => {
  if (newSalary * 12 >= 55000) { expatriate_relief = 0.5 }
  else expatriate_relief = 0.2
})
const si = $computed(() => rnd(Math.min((gross_salary + bonus + hf), restrictions_of_ci[year]) * si_percent[year]))

const nhs_si = $computed(() => rnd(Math.min(restrictions_of_gesy, gross_salary) * nhs_si_percent))

const months = $ref(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"])

const taxable_source_of_income = $computed(() => rnd(gross_salary * 12))

const expatriate_relief_value = $computed(() => {
  if (expatriate_relief == 0.2 && rnd(taxable_source_of_income * expatriate_relief) > 8550) return 8550
  return rnd(taxable_source_of_income * expatriate_relief)
})

const net_income = $computed(() => rnd(taxable_source_of_income - expatriate_relief_value - donations))

const personal_allowances = $computed(() => rnd(net_income / 5)
)
const social_insurance_contributions = $computed(() => rnd((si + nhs_si) * 12))

const taxable_income = $computed(() => {
  return net_income - Math.min(personal_allowances, social_insurance_contributions)
})
const tax_ranges = [
  { min: 0, max: 19500, percent: 0 },
  { min: 19500, max: 28000, percent: 0.2 },
  { min: 28000, max: 36300, percent: 0.25 },
  { min: 36300, max: 60000, percent: 0.3 },
  { min: 60000, max: 1000000, percent: 0.35 },
]
const tax_calculated = $computed(() => {
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
  return tax_results
})
const annual_tax_payable = $computed(() => {
  return rnd(tax_calculated.reduce((a, v) => a + v.tax, 0))
})
const tax = $computed(() => rnd(annual_tax_payable / 12))
const net_salary = $computed(() => rnd(gross_salary - nhs_si - si - tax))
//console.log(annual_tax_payable)
const rows = $computed(() => {
  return months.map((item) => {
    return {
      month: item,
      gross_salary: gross_salary,
      bonus: bonus,
      si: si,
      nhs_si: nhs_si,
      tax: tax,
      net_salary: net_salary
    }
  })
})

const calculate = () => {
  gross_salary = net_salary_expected * 1.15
  let gross_salary2 = net_salary_expected * 1.15
  let dif = 10000
  for (let i = 1; i <= 10; i++) {
    gross_salary = Math.round((net_salary_expected / net_salary) * gross_salary2)
    let dif2 = Math.abs(net_salary_expected - net_salary)

    if (dif2 < dif) {
      gross_salary2 = net_salary_expected - net_salary > 0 ? gross_salary + 1 : gross_salary
      dif = dif2
    }
    console.log(gross_salary, dif2)
  }
  gross_salary = rnd(gross_salary2)
} 
</script>