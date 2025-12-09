
const fs = require('fs');

const content = fs.readFileSync('client/src/pages/home.tsx', 'utf8');
const lines = content.split('\n');

// Keep lines up to 1113 (inclusive of index 1112)
// Line 1113 in `cat -n` is index 1112.
// So lines.slice(0, 1113) gives indices 0 to 1112.
const keptLines = lines.slice(0, 1113);

const newContent = `                        </div>

                        {/* Right Column: Stackable Discounts Controls */}
                        <div className="bg-background border border-border p-4 rounded-xl w-full md:w-80 shadow-sm">
                           <h5 className="font-bold text-sm mb-3 flex items-center gap-2">
                             <Zap className="w-4 h-4 text-accent fill-accent" />
                             Stackable Discounts
                           </h5>
                           <div className="space-y-4">
                             {/* Agreement Term */}
                             <div className="space-y-2 pb-3 border-b border-border/50">
                               <Label className="text-xs font-bold uppercase text-muted-foreground">Service Agreement</Label>
                               <RadioGroup 
                                 value={discounts.agreement} 
                                 onValueChange={(val) => setDiscounts(prev => ({ ...prev, agreement: val }))}
                                 className="flex flex-col gap-2"
                               >
                                 <div className="flex items-center space-x-2">
                                   <RadioGroupItem value="none" id="term-none" />
                                   <Label htmlFor="term-none" className="text-sm font-medium">Month-to-Month (Standard)</Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                   <RadioGroupItem value="1year" id="term-1year" />
                                   <Label htmlFor="term-1year" className="text-sm font-medium flex-1 flex justify-between">
                                     <span>1-Year Agreement</span>
                                     <span className="text-green-600 font-bold text-xs bg-green-100 px-1 rounded">1 Mo. Free</span>
                                   </Label>
                                 </div>
                                 <div className="text-[10px] text-muted-foreground ml-6 -mt-1 mb-1">
                                   *If signed by December
                                 </div>
                                 <div className="flex items-center space-x-2">
                                   <RadioGroupItem value="2year" id="term-2year" />
                                   <Label htmlFor="term-2year" className="text-sm font-medium flex-1 flex justify-between">
                                     <span>2-Year Agreement</span>
                                     <span className="text-green-600 font-bold text-xs bg-green-100 px-1 rounded">3 Mo. Free</span>
                                   </Label>
                                 </div>
                               </RadioGroup>
                             </div>

                             {/* Payment Method */}
                             <div className="flex items-start space-x-3">
                               <Checkbox 
                                 id="discount-payFull" 
                                 checked={discounts.payFull}
                                 onCheckedChange={(c) => setDiscounts(prev => ({ ...prev, payFull: !!c }))}
                               />
                               <div className="grid gap-1.5 leading-none">
                                 <label
                                   htmlFor="discount-payFull"
                                   className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                 >
                                   Pay Full Term Upfront
                                 </label>
                                 <p className="text-xs text-muted-foreground">
                                   {discounts.agreement === "2year" ? "Save additional 15%" : "Save additional 10%"}
                                 </p>
                               </div>
                             </div>

                             <div className="flex items-start space-x-3">
                               <Checkbox 
                                 id="discount-veteran" 
                                 checked={discounts.veteran}
                                 onCheckedChange={(c) => setDiscounts(prev => ({ ...prev, veteran: !!c }))}
                               />
                               <div className="grid gap-1.5 leading-none">
                                 <label
                                   htmlFor="discount-veteran"
                                   className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                 >
                                   Veteran / Active Duty
                                 </label>
                                 <p className="text-xs text-muted-foreground">Save extra 5%</p>
                               </div>
                             </div>

                             <div className="flex items-start space-x-3">
                               <Checkbox 
                                 id="discount-senior" 
                                 checked={discounts.senior}
                                 onCheckedChange={(c) => setDiscounts(prev => ({ ...prev, senior: !!c }))}
                               />
                               <div className="grid gap-1.5 leading-none">
                                 <label
                                   htmlFor="discount-senior"
                                   className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                 >
                                   Senior / Responder
                                 </label>
                                 <p className="text-xs text-muted-foreground">Save extra 5%</p>
                               </div>
                             </div>
                           </div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mt-2 text-center md:text-left border-t border-primary/10 pt-4">
                        Best value pricing for 2025. Savings passed directly to you through AI-driven efficiency.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button type="submit" size="lg" className="w-full text-lg font-bold uppercase tracking-wider h-14 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20">
                  Deploy My Service
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  By submitting, you agree to receive text/email communications about your quote. We never sell your data.
                </p>
              </form>
            </Form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <img src={mascotLogo} alt="Lawn Trooper" className="h-12 w-12 object-contain rounded-full bg-white/10 p-1" />
              <div className="text-left">
                <h3 className="font-heading font-bold text-xl tracking-tight">LAWN TROOPER</h3>
                <p className="text-xs text-primary-foreground/70">Your Yard, Always Mission-Ready.</p>
              </div>
            </div>
            <div className="flex gap-6 text-sm font-medium text-primary-foreground/80">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="text-center text-xs text-primary-foreground/40">
            &copy; {new Date().getFullYear()} Lawn Trooper Landscape Maintenance. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
`;

fs.writeFileSync('client/src/pages/home.tsx', keptLines.join('\n') + '\n' + newContent);
console.log('File updated successfully');
