/** End-of-month contributions; nominal annual rate compounded monthly. */
export function projectSavings(monthly:number,years:number,annualRate:number){
 const months=Math.round(years*12);const rate=annualRate/1200;
 const points=Array.from({length:years+1},(_,year)=>{const n=year*12;return {year,contributions:monthly*n,value:rate===0?monthly*n:monthly*Math.expm1(n*Math.log1p(rate))/rate};});
 return {points,contributions:monthly*months,value:points[points.length-1].value};
}
export function formatRupees(value:number){return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(value);}

/** Monthly amount required for a target, using the same ordinary-annuity assumption. */
export function requiredContribution(target:number,years:number,annualRate:number){
 const months=Math.round(years*12),rate=annualRate/1200;
 return rate===0?target/months:target*rate/Math.expm1(months*Math.log1p(rate));
}
