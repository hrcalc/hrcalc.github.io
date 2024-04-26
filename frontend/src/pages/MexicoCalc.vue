<template>
  <v-container>
    <v-responsive class="align-center" min-width="1024">
      <v-row>
        <v-col cols="4">
          <h4>Tax calculator Mexico</h4>
          <v-select v-model="year" :items="[2023, 2024]" label="Year"></v-select>
          <v-text-field label="Gross Salary" v-model.number="gross_salary" type="number" hide-details
            prefix="$"></v-text-field>
          <v-text-field label="Net Salary (€)" v-model="net_salary_expected" type="number" hide-details
            append-inner-icon="mdi-calculator" @click:append-inner="calculate"></v-text-field>
          <v-text-field label="Exchange Rate EUR to MXN" v-model="exchange_rate" type="number"></v-text-field>
          <div>Expected Net Salary: {{ expected_net_salary }}</div>
          <v-list density="compact">
            <v-list-item>
              <v-list-item-title class="font-weight-bold">Taxable income calculation</v-list-item-title>
            </v-list-item>
            <v-list-item title="Payroll salary">
              <template v-slot:append>$ {{ payroll_salary }}</template>
            </v-list-item>
            <v-list-item title="Daily salary">
              <template v-slot:append>$ {{ rnd(daily_salary) }}</template>
            </v-list-item>
            <v-list-item title="Christmas bonus">
              <template v-slot:append>$ {{ christmas_bonus }}</template>
            </v-list-item>
            <v-list-item title="Vacation premium">
              <template v-slot:append>$ {{ rnd(vacation_premium) }}</template>
            </v-list-item>
          </v-list>
        </v-col>
        <!--<v-col cols="4">
          <v-list density="compact">
            <v-list-item>
              <v-list-item-title class="font-weight-bold">Salary tax calculation</v-list-item-title>
            </v-list-item>
            <v-list-item title="Payroll taxable incomes">
              <template v-slot:append>$ {{ payroll_salary }}</template>
            </v-list-item>
            <v-list-item title="Daily taxable incomes">
              <template v-slot:append>$ {{ rnd(daily_salary) }}</template>
            </v-list-item>
            <v-list-item title="Monthly taxable incomes">
              <template v-slot:append>$ {{ rnd(monthly_taxable_income) }}</template>
            </v-list-item>
            <v-list-item title="Monthly ISR">
              <template v-slot:append>$ {{ rnd(monthly_isr) }}</template>
            </v-list-item>
            <v-list-item title="Actual tax rate">
              <template v-slot:append>{{ rnd(actual_tax_rate) }} %</template>
            </v-list-item>
            <v-list-item title="ISR tax (payroll)">
              <template v-slot:append>$ {{ rnd(isr_tax) }} </template>
            </v-list-item>
            <v-list-item title="Fix integrated salary">
              <template v-slot:append>$ {{ rnd(fix_integrated_salary) }} </template>
            </v-list-item>
            <v-list-item title="SDI">
              <template v-slot:append>$ {{ rnd(sdi) }} </template>
            </v-list-item> 
            <v-list-item title="IMSS Tax">
              <template v-slot:append>$ {{ rnd(imss_tax) }} </template>
            </v-list-item>
            <v-list-item title="Net salary">
              <template v-slot:append>$ {{ rnd(net_salary) }} </template>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="4">
          <v-list density="compact">
            <v-list-item>
              <v-list-item-title class="font-weight-bold">Christmas month tax calculation</v-list-item-title>
            </v-list-item>
            <v-list-item title="Gross Salary">
              <template v-slot:append>$ {{ gross_salary }}</template>
            </v-list-item>
            <v-list-item title="Christmas taxable part">
              <template v-slot:append>$ {{ christmas_bonus_taxable_part }}</template>
            </v-list-item>  
            <v-list-item title="Christmas taxable base">
              <template v-slot:append>$ {{ rnd(christmas_taxable_base) }}</template>
            </v-list-item>                        
            <v-list-item title="ISR tax">
              <template v-slot:append>$ {{ rnd(christmas_month_tax) }} </template>
            </v-list-item>
            <v-list-item title="IMSS tax">
              <template v-slot:append>$ {{ rnd(imss_tax) }} </template>
            </v-list-item>
            <v-list-item title="Net Salary">
              <template v-slot:append>$ {{ rnd(christmas_net_salary) }} </template>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="font-weight-bold">Vacation month tax calculation</v-list-item-title>
            </v-list-item>
            <v-list-item title="Gross Salary">
              <template v-slot:append>$ {{ gross_salary }}</template>
            </v-list-item>
            <v-list-item title="Anniversary taxable part">
              <template v-slot:append>$ {{ rnd(vacation_taxable_part) }}</template>
            </v-list-item>  
            <v-list-item title="Anniversary taxable base">
              <template v-slot:append>$ {{ rnd(vacation_taxable_base) }}</template>
            </v-list-item>                     
            <v-list-item title="ISR tax">
              <template v-slot:append>$ {{ rnd(vacation_month_tax) }} </template>
            </v-list-item>
            <v-list-item title="IMSS tax">
              <template v-slot:append>$ {{ rnd(imss_tax) }} </template>
            </v-list-item>
            <v-list-item title="Net Salary">
              <template v-slot:append>$ {{ rnd(vacation_net_salary) }} </template>
            </v-list-item>
          </v-list>
        </v-col>-->
        <v-col cols="8">
          <v-table density="compact">
            <thead>
              <tr>
                <th class="text-left">Month</th>
                <th class="text-left">Base Salary</th>
                <th class="text-left">MX bonuses</th>
                <th class="text-left">Tax</th>
                <th class="text-left">Net Salary</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-left">Normal</td>
                <td class="text-left">$ {{ gross_salary }}</td>
                <td class="text-left">$ 0</td>
                <td class="text-left">$ {{ rnd(isr_tax + imss_tax) }}</td>
                <td class="text-left">$ {{ rnd(net_salary) }}</td>
              </tr>
              <tr>
                <td class="text-left">December</td>
                <td class="text-left">$ {{ gross_salary }}</td>
                <td class="text-left">$ {{ rnd(christmas_bonus) }}</td>
                <td class="text-left">$ {{ rnd(isr_tax + christmas_actual_tax + imss_tax) }}</td>
                <td class="text-left">$ {{ rnd(christmas_net_salary) }}</td>
              </tr>
              <tr>
                <td class="text-left">Anniversary</td>
                <td class="text-left">$ {{ gross_salary }}</td>
                <td class="text-left">$ {{ rnd(vacation_premium) }}</td>
                <td class="text-left">$ {{ rnd(isr_tax + vacation_actual_tax + imss_tax) }}</td>
                <td class="text-left">$ {{ rnd(vacation_net_salary) }}</td>
              </tr>
              <tr>
                <td class="text-left" colspan="4">Average for 12 month</td>
                <td class="text-left">$ {{ rnd(average_net_calculation) }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
let gross_salary = $ref(100000)
let net_salary_expected = $ref(0)
let exchange_rate = $ref(18.5)
let expected_net_salary = $computed(() => net_salary_expected*exchange_rate)
let year = $ref(new Date().getFullYear())
let payroll_salary = $computed(() => gross_salary/2)
let daily_salary = $computed(() => gross_salary/30)
let christmas_bonus = $computed(() => gross_salary/2)
let vacation_premium = $computed(() => gross_salary/6)
let monthly_taxable_income = $computed(() => daily_salary*30.4)
let uma_by_year: Record<number, number> = {
  2024: 108.57
}
let uma = $computed(() => uma_by_year[year])

const rnd = (f: number=0) => Math.round((f + Number.EPSILON) * 100) / 100

let tax_table = [
  {min: 0.01, max: 746.04, fixed: 0, percent: 0.02},
  {min: 746.05, max: 6332.05, fixed: 14.32, percent: 0.06},
  {min: 6332.06, max: 11128.01, fixed: 371.83, percent: 0.11},
  {min: 11128.02, max: 12935.82, fixed: 893.63, percent: 0.16},
  {min: 12935.83, max: 15487.71, fixed: 1182.88, percent: 0.18},
  {min: 15487.72, max: 31236.49, fixed: 1640.18, percent: 0.21},
  {min: 31236.50, max: 49233.00, fixed: 5004.12, percent: 0.24},
  {min: 49233.01, max: 93993.90, fixed: 9236.89, percent: 0.3},
  {min: 93993.91, max: 125325.20, fixed: 22665.17, percent: 0.32},
  {min: 125325.21, max: 375975.61, fixed: 32691.18, percent: 0.34},
  {min: 375975.62, max: 100000000, fixed: 117912.32, percent: 0.35},
]

const calculate_isr = (monthly_income: number) => {
  for(let range of tax_table){
    if(range.min < monthly_income && monthly_income < range.max ){
      return (monthly_income - range.min)*range.percent + range.fixed
    }
  }
  return 0
}

let monthly_isr = $computed(() => calculate_isr(monthly_taxable_income))
let monthly_isr2 = $computed(() => calculate_isr(gross_salary))

let daily_isr = $computed(() => monthly_isr/30.4)
let payroll_isr = $computed(() => daily_isr*15)
let isr_tax = $computed(() => payroll_isr*2)

// let actual_tax_rate = payroll_isr/payroll_salary*100

let fix_integrated_salary = $computed(() => {
  return daily_salary + 15/366*daily_salary + 20/366 * 0.25 * daily_salary
})
let sdi = $computed(() => Math.min(fix_integrated_salary, 25*uma))
let imss_tax = $computed(() => {
  return sdi * (0.0025*30 + 0.00375*30 + 0.00625*30 + 0.01125*30) + (sdi > uma*3 ? (sdi-uma*3)*0.004*30 : 0)
})
let net_salary = $computed(() => {
  return gross_salary - isr_tax - imss_tax
})

let christmas_bonus_taxable_part = $computed(() => christmas_bonus - 30*uma)
let christmas_monthly_taxable_income = $computed(() => christmas_bonus_taxable_part/365*30.4)
let christmas_taxable_base = $computed(() => gross_salary + christmas_monthly_taxable_income)
let christmas_month_tax = $computed(() => {
  return calculate_isr(christmas_taxable_base)
})
let christmas_diff = $computed(() => christmas_month_tax - monthly_isr2)
let christmas_tax_rate = $computed(() => christmas_diff/christmas_monthly_taxable_income)
let christmas_actual_tax = $computed(() => christmas_tax_rate*christmas_bonus_taxable_part)
let christmas_net_salary = $computed(() => {
  return gross_salary + christmas_bonus - isr_tax - christmas_actual_tax - imss_tax
})

let vacation_taxable_part = $computed(() => vacation_premium - 15*uma)
let vacation_monthly_taxable_income = $computed(() => vacation_taxable_part/365*30.4)
let vacation_taxable_base = $computed(() => gross_salary + vacation_monthly_taxable_income)
let vacation_month_tax = $computed(() => {
  return calculate_isr(vacation_taxable_base)
})
let vacation_diff = $computed(() => vacation_month_tax - monthly_isr2)
let vacation_tax_rate = $computed(() => vacation_diff/vacation_monthly_taxable_income)
let vacation_actual_tax = $computed(() => vacation_tax_rate*vacation_taxable_part)
let vacation_net_salary = $computed(() => {
  return gross_salary + vacation_premium - isr_tax - vacation_actual_tax - imss_tax
})

let average_net_calculation = $computed(() => (net_salary*10 + christmas_net_salary + vacation_net_salary)/12)


const calculate = () => {
  gross_salary = expected_net_salary * 1.3
  let gross_salary2 = expected_net_salary * 1.3
  let dif = 10000
  for (let i = 1; i <= 10; i++) {
    gross_salary = Math.round((expected_net_salary / average_net_calculation) * gross_salary2)
    let dif2 = Math.abs(expected_net_salary - average_net_calculation)

    if (dif2 < dif) {
      gross_salary2 = expected_net_salary - average_net_calculation > 0 ? gross_salary + 1 : gross_salary
      dif = dif2
    }
    console.log(gross_salary, dif2)
  }
  gross_salary = rnd(gross_salary2)
}
</script>