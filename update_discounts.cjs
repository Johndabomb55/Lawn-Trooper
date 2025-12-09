
const fs = require('fs');

const filePath = 'client/src/pages/home.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update Mission Briefing (Hero Section)
// Replace the old grid of deals with the new logic
const oldMissionBriefing = `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                 {/* Deal 1 */}
                 <div className="bg-white/5 p-3 rounded border border-white/10 hover:border-accent/50 transition-colors">
                   <div className="flex items-center gap-2 mb-1">
                     <Calendar className="w-4 h-4 text-accent" />
                     <span className="text-accent font-bold uppercase text-xs">Agreement Terms</span>
                   </div>
                   <div className="text-white text-sm font-medium">
                     <div className="flex justify-between"><span>2-Year Pact:</span> <span className="text-green-400 font-bold">3 Months Free</span></div>
                     <div className="flex justify-between"><span>1-Year Pact:</span> <span className="text-green-400 font-bold">1 Month Free</span></div>
                   </div>
                 </div>

                 {/* Deal 2 */}
                 <div className="bg-white/5 p-3 rounded border border-white/10 hover:border-accent/50 transition-colors">
                   <div className="flex items-center gap-2 mb-1">
                     <Zap className="w-4 h-4 text-accent" />
                     <span className="text-accent font-bold uppercase text-xs">Pay Upfront</span>
                   </div>
                   <div className="text-white text-sm font-medium">
                     <div className="flex justify-between"><span>2-Year Term:</span> <span className="text-green-400 font-bold">15% OFF</span></div>
                     <div className="flex justify-between"><span>1-Year Term:</span> <span className="text-green-400 font-bold">10% OFF</span></div>
                   </div>
                 </div>

                 {/* Deal 3 */}
                 <div className="bg-white/5 p-3 rounded border border-white/10 hover:border-accent/50 transition-colors">
                   <div className="flex items-center gap-2 mb-1">
                     <Shield className="w-4 h-4 text-accent" />
                     <span className="text-accent font-bold uppercase text-xs">Service Honors</span>
                   </div>
                   <div className="text-white text-sm font-medium">
                     <div className="flex justify-between"><span>Veterans:</span> <span className="text-green-400 font-bold">5% OFF</span></div>
                     <div className="flex justify-between"><span>Seniors:</span> <span className="text-green-400 font-bold">5% OFF</span></div>
                   </div>
                 </div>

                 {/* Deal 4 */}
                 <div className="bg-accent/10 p-3 rounded border border-accent/30 flex flex-col justify-center items-center text-center">
                   <div className="text-accent font-black text-2xl mb-1">STACKABLE</div>
                   <div className="text-white/80 text-xs leading-tight">
                     Combine all discounts for maximum mission savings.
                   </div>
                 </div>
               </div>`;

const newMissionBriefing = `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                 {/* Deal 1 */}
                 <div className="bg-white/5 p-3 rounded border border-white/10 hover:border-accent/50 transition-colors">
                   <div className="flex items-center gap-2 mb-1">
                     <Calendar className="w-4 h-4 text-accent" />
                     <span className="text-accent font-bold uppercase text-xs">Price Lock</span>
                   </div>
                   <div className="text-white text-sm font-medium">
                     <div className="flex justify-between"><span>2-Year Pact:</span> <span className="text-green-400 font-bold">Lock Price 24 Mo</span></div>
                     <div className="flex justify-between"><span>1-Year Pact:</span> <span className="text-green-400 font-bold">Lock Price 12 Mo</span></div>
                   </div>
                 </div>

                 {/* Deal 2 */}
                 <div className="bg-white/5 p-3 rounded border border-white/10 hover:border-accent/50 transition-colors">
                   <div className="flex items-center gap-2 mb-1">
                     <Zap className="w-4 h-4 text-accent" />
                     <span className="text-accent font-bold uppercase text-xs">Pay Upfront</span>
                   </div>
                   <div className="text-white text-sm font-medium">
                     <div className="flex justify-between"><span>2-Year Term:</span> <span className="text-green-400 font-bold">15% OFF</span></div>
                     <div className="flex justify-between"><span>1-Year Term:</span> <span className="text-green-400 font-bold">10% OFF</span></div>
                   </div>
                 </div>

                 {/* Deal 3 */}
                 <div className="bg-white/5 p-3 rounded border border-white/10 hover:border-accent/50 transition-colors">
                   <div className="flex items-center gap-2 mb-1">
                     <Shield className="w-4 h-4 text-accent" />
                     <span className="text-accent font-bold uppercase text-xs">Service Honors</span>
                   </div>
                   <div className="text-white text-sm font-medium">
                     <div className="flex justify-between"><span>Veterans:</span> <span className="text-green-400 font-bold">5% OFF</span></div>
                     <div className="flex justify-between"><span>Seniors:</span> <span className="text-green-400 font-bold">5% OFF</span></div>
                   </div>
                 </div>

                 {/* Deal 4 */}
                 <div className="bg-accent/10 p-3 rounded border border-accent/30 flex flex-col justify-center items-center text-center">
                   <div className="text-accent font-black text-2xl mb-1">STACKABLE</div>
                   <div className="text-white/80 text-xs leading-tight">
                     Combine all discounts for maximum mission savings.
                   </div>
                 </div>
               </div>
               
               <div className="mt-4 text-xs text-white/60 text-center italic border-t border-white/10 pt-2">
                 * Subscription price is subject to change so lock your price in for up to 2 years with an agreement. You can always downgrade plans or upgrade at anytime but there is no guarantee the prices will stay this low for the maintenance packages.
               </div>`;

content = content.replace(oldMissionBriefing, newMissionBriefing);

// 2. Remove Free Months Calculation
// Remove:
/*
  const termMonths = discounts.agreement === "2year" ? 24 : 12;
  let freeMonths = 0;
  if (discounts.agreement === "1year") freeMonths = 1;
  if (discounts.agreement === "2year") freeMonths = 3;
  
  const billableMonths = termMonths - freeMonths;
*/
// Replace with:
/*
  const termMonths = discounts.agreement === "2year" ? 24 : 12;
  const billableMonths = termMonths; // No free months
*/

const oldCalc = `const termMonths = discounts.agreement === "2year" ? 24 : 12;
  let freeMonths = 0;
  if (discounts.agreement === "1year") freeMonths = 1;
  if (discounts.agreement === "2year") freeMonths = 3;
  
  const billableMonths = termMonths - freeMonths;`;

const newCalc = `const termMonths = discounts.agreement === "2year" ? 24 : 12;
  const freeMonths = 0; // Removed per new policy
  
  const billableMonths = termMonths;`;

content = content.replace(oldCalc, newCalc);

// 3. Update the Radio Group Labels (Form Section)
// Search for the radio group labels and remove the "X Mo. Free" badges
// Old:
/*
                                   <Label htmlFor="term-1year" className="text-sm font-medium flex-1 flex justify-between">
                                     <span>1-Year Agreement</span>
                                     <span className="text-green-600 font-bold text-xs bg-green-100 px-1 rounded">1 Mo. Free</span>
                                   </Label>
*/
// New:
/*
                                   <Label htmlFor="term-1year" className="text-sm font-medium flex-1 flex justify-between">
                                     <span>1-Year Agreement</span>
                                     <span className="text-green-600 font-bold text-xs bg-green-100 px-1 rounded">Price Lock</span>
                                   </Label>
*/

// Using regex or string replacement for robustness
content = content.replace(
    '<span className="text-green-600 font-bold text-xs bg-green-100 px-1 rounded">1 Mo. Free</span>', 
    '<span className="text-green-600 font-bold text-xs bg-green-100 px-1 rounded">Price Lock</span>'
);

content = content.replace(
    '<span className="text-green-600 font-bold text-xs bg-green-100 px-1 rounded">3 Mo. Free</span>', 
    '<span className="text-green-600 font-bold text-xs bg-green-100 px-1 rounded">Price Lock</span>'
);

// 4. Update Savings Badge Logic (Line ~1070 in original read, likely different now)
// We need to find the logic inside the JSX that calculates savings badge
/*
                                  let freeMonths = 0;
                                  if (discounts.agreement === "1year") freeMonths = 1;
                                  if (discounts.agreement === "2year") freeMonths = 3;
*/
// We need to replace this inside the render function too if it's duplicated (it was in the previous `read` output inside `render`)

// Let's use a regex to find all occurrences of free months logic block and replace it
// Since the block structure is consistent:
/*
                                  let freeMonths = 0;
                                  if (discounts.agreement === "1year") freeMonths = 1;
                                  if (discounts.agreement === "2year") freeMonths = 3;
*/
// We can replace all occurrences.
const freeMonthsLogicRegex = /let\s+freeMonths\s*=\s*0;\s*if\s*\(discounts\.agreement\s*===\s*"1year"\)\s*freeMonths\s*=\s*1;\s*if\s*\(discounts\.agreement\s*===\s*"2year"\)\s*freeMonths\s*=\s*3;/g;
content = content.replace(freeMonthsLogicRegex, 'let freeMonths = 0;');

// Also remove the explanation text about free months
// Old: * Monthly payment reflects the discounted rate. You pay ${discountedMonthlyPayment.toFixed(0)} for {termMonths} months. The last {freeMonths} months are $0.
// New: * Monthly payment reflects the discounted rate. You pay ${discountedMonthlyPayment.toFixed(0)} for {termMonths} months.
const explanationRegex = /The last \{freeMonths\} months are \$0\./g;
content = content.replace(explanationRegex, '');


fs.writeFileSync(filePath, content);
console.log('Home page updated successfully');
