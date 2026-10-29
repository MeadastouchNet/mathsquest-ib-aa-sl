import { lesson, mc, num, tf, F, M, tbl, A } from './lesson.js';
import { SCI_KEYS } from '../calc.js';
// Verified against the official first-assessment-2021 guide, SL1.1–SL1.9.
// Running case: Noor grows a gaming channel and saves for a festival.
export const unit1 = {id:'1', title:'Number and algebra', emoji:'∑', calcKeys:SCI_KEYS,
blurb:'Help Noor grow a gaming channel, spot patterns and fund a festival. Nine lessons turn big numbers into useful predictions.', sections:[
lesson('1.1','Scientific notation and accuracy',
'Noor’s channel has millions of views, but each frame lasts a tiny fraction of a second. Long strings of zeros make comparisons awkward. You need a notation that handles both scales. How can you multiply these numbers without losing their size?',[
['Scientific notation',`<p><b>Scientific notation</b> uses a coefficient whose magnitude is at least 1 and less than 10, multiplied by an integer power of ten.</p>${F`4800000=4.8\times10^6`}<div class="example">A frame time of 0.004 seconds is ${M`4\times10^{-3}`} seconds.</div>`],
['Calculate with powers',`${F`(3\times10^4)(2\times10^{-2})=6\times10^2`}<p>Multiply coefficients and add powers. For division, divide coefficients and subtract powers. Renormalise the coefficient when it reaches 10.</p>`],
['Report accuracy',`<p>Keep extra digits in working and round once at the end. Unless instructed otherwise, non-exact exam answers are normally given to three significant figures.</p><div class="tip">Write the mathematical power of ten, rather than calculator E notation. Distinguish an exact answer from a rounded approximation.</div>`]
],['Frame storage', 'Each frame needs 250,000 bytes; a clip contains 400 frames.',
['How do you rewrite the inputs?',F`2.5\times10^5,\quad4\times10^2`],['What is the product?',F`10\times10^7`],['How do you normalise it?',F`1.0\times10^8\text{ bytes}`]], [
mc('Which is normalised scientific notation?',['12 × 10³','0.8 × 10⁵','8 × 10⁴','80 × 10²'],2,'The coefficient must be at least 1 and less than 10.'),
mc('What should you write instead of 3.2E5?',['3.2 × 10⁵','3.2 × 5','32 × 10⁵','3.2 + 10⁵'],0,'The E display means times ten to the displayed power.'),
num('Calculate the product.'+tbl(['Value','Number'],[['A','3 × 10⁴'],['B','2 × 10⁻²'],['Product',A(600,true)]]),600,'Multiply 3 by 2 and add 4 + (−2).'),
num('Write 0.00056 as a coefficient times ten to a power. Enter the exponent.',-4,'Move the decimal four places right to obtain 5.6; the exponent is −4.'),
tf('Rounding every intermediate result always improves accuracy.',false,'Premature rounding accumulates error. Round only the final result.'),
num('Round 12.346 to three significant figures.',12.3,'The first three significant digits are 1, 2, 3. The next digit is 4.',0.0001)
], 'multiply and compare numbers in scientific notation.'),
lesson('1.2','Arithmetic sequences and series',
'Noor gains 30 followers in week one, 50 in week two and 70 in week three. The gain rises by the same amount each week. A single week and the total growth are different questions. Can you predict both without listing every week?',[
['Constant addition',`<p>An <b>arithmetic sequence</b> has constant common difference d.</p>${F`u_n=u_1+(n-1)d`}<div class="example">For 30, 50, 70, the difference is 20 and the fourth term is 90.</div>`],
['Add the terms',`${F`S_n=\frac n2[2u_1+(n-1)d]`}<p>A series is a sum. Sigma notation tells you which terms to add.</p>${F`\sum_{k=1}^{4}(30+20(k-1))=240`}`],
['Test a model',`<p>Real follower counts rarely rise perfectly evenly. Estimate the difference, compare predictions with actual values and say when the model stops being plausible.</p><div class="tip">Find means determine the value. Identify the first term and common difference before substituting; use n−1, not n.</div>`]
],['Total followers gained','Weekly gains follow 30, 50, 70, … for four weeks.',
['What changes each week?','The common difference is 20.'],['Find the fourth term.',F`u_4=30+3(20)=90`],['Find the four-week total.',F`S_4=\frac42(30+90)=240`]], [
mc('Which list is arithmetic?',['2, 4, 8, 16','3, 7, 11, 15','1, 4, 9, 16','2, 3, 5, 8'],1,'Successive differences are all 4.'),
mc('Which expression gives the tenth term?',['30 + 10 × 20','10(30 + 20)','30 + 9 × 20','30 × 20⁹'],2,'There are nine increments between terms one and ten.'),
num('Complete the sequence.'+tbl(['Week','Gain'],[['1','30'],['2','50'],['5',A(110,true)]]),110,'30 + 4 × 20 = 110.'),
num('Find the sum of the first four terms of 30, 50, 70, …',240,'The fourth term is 90; 4(30+90)/2 = 240.'),
tf('A negative common difference is allowed.',true,'An arithmetic sequence may decrease, for example 10, 7, 4.'),
num('Find n if the nth term of 30, 50, 70, … is 210.',10,'210 = 30 + 20(n−1), so n−1 = 9.')
], 'distinguish an arithmetic term from an arithmetic sum.'),
lesson('1.3','Geometric sequences and series',
'A shared clip reaches twice as many people in each round. Noor first reaches 40 people, then 80, then 160. The difference grows, but the multiplier stays fixed. How many people does the fourth round reach, and what is the total?',[
['Constant multiplication',`<p>A <b>geometric sequence</b> has common ratio r.</p>${F`u_n=u_1r^{n-1}`}<p>For 40, 80, 160, the ratio is 2. Divide a term by the previous non-zero term to find r.</p>`],
['A finite sum',`${F`S_n=\frac{u_1(1-r^n)}{1-r}\quad(r\ne1)`}<p>When r=1, all terms are equal and the sum is n times the first term. Sigma notation works for geometric sums too.</p>`],
['Growth or decay?',`<p>A positive ratio between 0 and 1 gives decay. A ratio above 1 gives growth. A negative ratio alternates signs.</p><div class="tip">State your assumed constant ratio. A viral growth model can fail when the reachable audience becomes saturated.</div>`]
],['Four rounds of sharing','Reach is 40, 80, 160, … with no repeated viewers assumed.',
['Identify the multiplier.','r = 80/40 = 2.'],['Predict round four.',F`u_4=40(2^3)=320`],['Add the four rounds.',F`S_4=40\frac{2^4-1}{2-1}=600`]], [
mc('Which ratio describes a 20% decrease each step?',['1.2','0.2','−0.2','0.8'],3,'Keeping 80% means multiplying by 0.8.'),
mc('Which list is geometric?',['4, 8, 12, 16','4, 12, 36, 108','4, 9, 16, 25','4, 7, 11, 16'],1,'Each term is three times its predecessor.'),
num('Complete the reach table.'+tbl(['Round','Reach'],[['1','40'],['2','80'],['4',A(320,true)]]),320,'40 × 2³ = 320.'),
num('Find the sum of 40 + 80 + 160 + 320.',600,'Use the finite geometric sum or add the four terms.'),
tf('Every geometric sequence increases.',false,'Ratios between 0 and 1 give decay; negative ratios alternate signs.'),
num('Find the fifth term when the first term is 80 and ratio is 0.5.',5,'80 × (0.5)⁴ = 5.')
], 'model repeated multiplication with a geometric sequence.'),
lesson('1.4','Compound interest and depreciation',
'Noor saves 1,000 kr for a festival. The account pays 5% each year, including on earlier interest. Meanwhile a used gaming laptop loses 20% of its value each year. Both are repeated multiplication. How do you compare the cash balance with what it can actually buy?',[
['Compounding',`${F`V=P\left(1+\frac{r}{100k}\right)^{kn}`}<p>P is principal, r the nominal annual percentage rate, k the number of compounding periods each year, and n the number of years. Match the period rate to the number of periods.</p>`],
['Depreciation',`<p>Annual <b>depreciation</b> at d percent keeps a fraction of the previous value.</p>${F`V=P\left(1-\frac d{100}\right)^n`}<div class="example">A 1,000 kr laptop becomes 800 kr, then 640 kr.</div>`],
['Inflation and technology',`${F`\text{real value}=\frac{\text{nominal value}}{(1+i)^n}`}<p>Here i is the annual inflation rate as a decimal. A GDC finance solver can model periods, rates and balances; check payment frequency and sign conventions.</p><div class="tip">Use a [[geometric sequence]] multiplier. Do not confuse 5% with 5, or monthly compounding with monthly annual rates.</div>`]
],['Two years of saving',tbl(['Quantity','Value'],[['Principal','1,000 kr'],['Annual interest','5%'],['Years','2']]),
['What is the annual multiplier?',F`1+0.05=1.05`],['What is the future balance?',F`1000(1.05)^2=1102.50`],['If inflation is also 5%, what is the real value?',F`1102.50/(1.05)^2=1000`]], [
mc('A nominal 12% annual rate compounded monthly uses which monthly rate?',['12%','1%','0.12%','144%'],1,'Divide the annual rate by 12; use 0.01 in the multiplier.'),
mc('Which multiplier models 20% annual depreciation?',['1.2','0.2','0.8','−0.8'],2,'The asset retains 80% each year.'),
num('Complete the savings table.'+tbl(['Year','Balance (kr)'],[['0','1,000'],['1',A(1050)],['2',A(1102.5,true)]]),1102.5,'Interest compounds: 1,000 × 1.05².',0.01),
num('A laptop costs 1,000 kr and depreciates by 20% annually. Find its value after two years.',640,'1,000 × 0.8² = 640 kr.'),
tf('A higher nominal balance always means higher purchasing power.',false,'Inflation can rise faster than the balance, reducing real purchasing power.'),
num('A balance becomes 1,100 kr after one year. Inflation was 10%. Find its value in starting-year kr.',1000,'Divide 1,100 by 1.10.')
], 'calculate compound growth, depreciation and inflation-adjusted value.'),
lesson('1.5','Integer exponents and logarithms',
'Noor doubles the size of a file repeatedly. Multiplication is easy when you know the number of doublings. Reversing the question is harder: how many doublings produce a given size? Logarithms record that missing exponent.',[
['Exponent laws',`${F`a^ma^n=a^{m+n},\quad\frac{a^m}{a^n}=a^{m-n}`} ${F`(a^m)^n=a^{mn},\quad a^{-n}=\frac1{a^n}`}<p>For these division rules the base must be non-zero. A negative exponent means reciprocal, not a negative value.</p>`],
['Reverse an exponent',`<p>A <b>logarithm</b> is an exponent.</p>${F`a^x=b\iff\log_a b=x`}<p>For real logarithms, a is positive and not 1, and b is positive. log usually means base 10; ln means base e.</p>`],
['Use your calculator',`${F`\log_{10}1000=3,\quad\ln(e^2)=2`}<p>Enter the whole logarithm argument in brackets. Exponentiation and taking a logarithm undo each other with matching bases.</p><div class="tip">Interpret the answer: log₂(8)=3 means three doublings, rather than three units of file size.</div>`]
],['Undo the doublings', 'A file begins at one unit and doubles until it reaches 32 units.',
['Write the equation.',F`2^x=32`],['Recognise the power.',F`32=2^5`],['Give the inverse statement.',F`\log_2(32)=5`]], [
mc('What is 2⁻³?',['−8','−6','1/8','1/6'],2,'A negative exponent takes the reciprocal of the positive power.'),
mc('What does log₁₀(100) ask?',['10 multiplied by 100','The power of 10 giving 100','100 divided by 10','The root of 100'],1,'A logarithm returns the missing exponent.'),
num('Calculate 2³ × 2⁴.',128,'Add exponents to obtain 2⁷ = 128.'),
num('Calculate log₁₀(100000).',5,'10⁵ = 100,000.'),
tf('ln(0) is a real number.',false,'The real natural logarithm is defined only for positive arguments.'),
num('Calculate 5⁴ divided by 5².',25,'Subtract the exponents to obtain 5².')
], 'use exponent laws and interpret logarithms as inverse operations.'),
lesson('1.6','Deductive proof and identities',
'Noor tests a scoring rule on three games and it works every time. Is that enough to guarantee it works for every possible score? A pattern suggests a claim, but algebra can establish it. Your task is to show why a rule always holds within its stated domain.',[
['Examples versus proof',`<p>A <b>deductive proof</b> starts from definitions and accepted facts and gives a chain of valid steps. Checking a few numbers supports a conjecture but does not establish a universal claim.</p><div class="example">Two even integers can be written 2m and 2n. Their sum is 2(m+n), so it is even.</div>`],
['Equality and identity',`${F`(x+2)^2\equiv x^2+4x+4`}<p>An identity holds for every permitted x. An equation such as x+2=5 holds only for its solutions. State restrictions, especially before division.</p>`],
['One side to the other',`<p>Begin with one side and simplify to the other. Avoid assuming the result you need to prove.</p><div class="tip">Show that requires the intermediate algebra even when the final result is printed in the question. Check your transformations and the domain.</div>`]
],['A scoring identity',`Show that ${M`(n+1)^2-n^2=2n+1`}.`,
['Expand the left-hand side.',F`n^2+2n+1-n^2`],['Collect like terms.',F`2n+1`],['What has this established?','The difference equals the right-hand side for every real n; in particular, consecutive integer squares differ by an odd number.']], [
mc('Which supports a universal algebraic proof?',['Testing three scores','A chain of valid identities','A graph with five points','A persuasive anecdote'],1,'A valid algebraic argument covers all permitted values.'),
mc('Which expression is always even for integer n?',['2n + 1','n + 1','2n','n² + 1'],2,'2n is an integer multiple of two.'),
num('Find the coefficient of x in (x+3)².',6,'Expand to x² + 6x + 9.'),
num('Check the identity (n+1)²−n² = 2n+1 at n=4. Enter the common value.',9,'25 − 16 = 9, and 8 + 1 = 9. The check alone is not a proof.'),
tf('An identity may be used at values where its denominator is zero.',false,'The original expression must be defined.'),
tf('Adding two even integers always gives an even integer.',true,'Write them as 2m and 2n; their sum is 2(m+n).')
], 'build a short deductive proof without assuming the conclusion.'),
lesson('1.7','Rational powers and logarithm laws',
'Noor’s audience triples over a period, but you want the time to a different target. Integer powers are too restrictive. Fractional powers and logarithm laws extend the same ideas. Which operations let you isolate an exponent?',[
['Rational exponents',`${F`a^{m/n}=(\sqrt[n]{a})^m`}<p>For positive a this rule is straightforward. An even root means the non-negative root.</p><div class="example">16 raised to the power 3/4 equals 8: take the fourth root, then cube.</div>`],
['Combine logarithms',`${F`\log_a(xy)=\log_a x+\log_a y`} ${F`\log_a(x/y)=\log_a x-\log_a y`} ${F`\log_a(x^p)=p\log_a x`}<p>Use positive x and y and a positive base other than 1. There is no matching addition rule for log(x+y).</p>`],
['Solve exponential equations',`${F`a^t=b\implies t=\frac{\ln b}{\ln a}`}<p>The change-of-base rule lets a natural-log key handle any valid base.</p><div class="tip">Give the exact logarithmic expression before a decimal approximation; substitute back to check.</div>`]
],['Reach a target','Solve 3ᵗ = 20 for the number of growth periods.',
['Take natural logs.',F`\ln(3^t)=\ln20`],['Bring the exponent down.',F`t\ln3=\ln20`],['Divide and interpret.',F`t=\frac{\ln20}{\ln3}\approx2.73`]], [
mc('Which equals log(xy) for positive x and y?',['log x × log y','log x + log y','log x − log y','log(x + y)'],1,'Products inside a logarithm become sums outside.'),
mc('Which solves 5ᵗ = 12?',['ln(5)/ln(12)','ln(12−5)','ln(12)/ln(5)','ln(12)−ln(5)'],2,'Take logarithms and divide by ln(5).'),
num('Calculate 16^(3/4).',8,'The fourth root of 16 is 2; 2³ = 8.'),
num('Calculate log₂(8) + log₂(4).',5,'3 + 2 = 5, also log₂(32).'),
tf('log(x+y) always equals log x + log y.',false,'For x=y=1, the left side is log 2 and the right side is zero.'),
num('Solve 2ᵗ = 10. Give t to three significant figures.',Math.log(10)/Math.log(2),'t = ln(10)/ln(2) ≈ 3.32.',0.005)
], 'solve exponential equations using logarithm laws.'),
lesson('1.8','Infinite geometric sums',
'Each repeat of Noor’s sound effect is half as loud as the previous one. The model has infinitely many echoes, yet their total contribution can be finite. How can an endless sum have a limit? The key is how quickly the remaining terms shrink.',[
['Convergence',`<p>A geometric series with non-zero first term converges when the magnitude of the ratio is less than one.</p>${F`|r|<1`}<p>Then successive powers tend to zero. A negative ratio can converge too: its terms alternate signs while shrinking.</p>`],
['The limiting sum',`${F`S_\infty=\frac{u_1}{1-r}`}<p>This is the limit of the finite geometric sum as the number of terms grows. It is not the value of an individual late term.</p><div class="example">8 + 4 + 2 + … approaches 16.</div>`],
['Check the condition first',`<p>Using the formula with r=2 produces a number, but that number is not the infinite sum: the series diverges.</p><div class="tip">State the convergence condition before finding the sum, especially when r contains an unknown parameter.</div>`]
],['An echo total','The echo contributions are 8, 4, 2, 1, … units.',
['What is r?','r = 1/2.'],['Does the infinite sum exist?',F`|1/2|<1`],['What does it approach?',F`S_\infty=\frac8{1-1/2}=16`]], [
mc('Which ratio gives a convergent geometric series?',['1','−1','1.2','−0.5'],3,'Its absolute value is less than one.'),
mc('What does the infinite sum of 8, 4, 2, … approach?',['0','8','16','Infinity'],2,'8/(1−0.5) = 16.'),
num('Find the infinite sum with first term 12 and ratio 0.25.',16,'12/(1−0.25) = 16.'),
num('Find the infinite sum with first term 6 and ratio −0.5.',4,'6/(1+0.5) = 4.'),
tf('If terms approach zero, their sum must approach zero.',false,'For example 8 + 4 + 2 + … approaches 16, although its individual terms approach zero.'),
num('The infinite sum is 20 and the ratio is 0.6. Find the first term.',8,'u₁ = 20(1−0.6) = 8.')
], 'decide whether a geometric series converges and find its limit.'),
lesson('1.9','The binomial theorem',
'Noor wants to expand a power without multiplying the same brackets again and again. The coefficients follow a pattern visible in Pascal’s triangle. Picking terms from brackets explains that pattern. Can you find a single coefficient without writing the entire expansion?',[
['Count choices',`${F`\binom nr=\frac{n!}{r!(n-r)!}`}<p>The <b>binomial coefficient</b> counts ways to choose r positions from n. Here 0!=1. Use factorials by hand and nCr on your GDC.</p>`],
['Expand a positive integer power',`${F`(a+b)^n=\sum_{r=0}^n\binom nr a^{n-r}b^r`}<p>The powers of a decrease as those of b increase. Pascal’s row for n=4 is 1, 4, 6, 4, 1.</p>`],
['Find a specified term',`<p>Identify the power first, then substitute the required r. Preserve the sign when b is negative.</p><div class="tip">The general term indexed r is term r+1. In (1−2x)³ the squared term is positive, while the cubed term is negative.</div>`]
],['One coefficient','Find the coefficient of x² in (1+2x)⁴.',
['Which index makes x²?','r = 2.'],['Find the combination.',F`\binom42=6`],['Include the power of 2.',F`6(2^2)=24`]], [
mc('Which is the Pascal row for n=3?',['1, 2, 1','1, 3, 3, 1','1, 4, 6, 4, 1','1, 3, 6, 1'],1,'Each interior entry sums the two entries above it.'),
mc('Which index r gives the x³ term of (1+x)⁵?',['2','3','4','5'],1,'The power of x is r; the term is the fourth term.'),
num('Calculate 5 choose 2.',10,'5!/(2!3!) = 10.'),
num('Find the coefficient of x² in (1+2x)⁴.',24,'Choose two brackets giving 2x: 6 × 4 = 24.'),
tf('The coefficient of x³ in (1−2x)³ is positive.',false,'The coefficient is (−2)³ = −8.'),
num('Find the constant term in (3+x)³.',27,'Choose 3 from each bracket: 3³ = 27.')
], 'use the binomial theorem to obtain coefficients.')
], formulas:[
{group:'Sequences',items:[{name:'Arithmetic term and sum',f:M`u_n=u_1+(n-1)d,\quad S_n=\frac n2(u_1+u_n)`},{name:'Geometric term',f:M`u_n=u_1r^{n-1}`},{name:'Geometric sums',f:M`S_n=\frac{u_1(1-r^n)}{1-r},\quad S_\infty=\frac{u_1}{1-r}`,note:'Finite formula: r≠1. Infinite formula: |r|<1.'}]},
{group:'Algebra',items:[{name:'Compound interest',f:M`V=P(1+\frac r{100k})^{kn}`},{name:'Change of base',f:M`\log_a b=\frac{\ln b}{\ln a}`},{name:'Binomial coefficient',f:M`\binom nr=\frac{n!}{r!(n-r)!}`}]}]};

unit1.sections[2].labs.push({type: 'sequence'});
