
        const form = document.getElementById('predictionForm');
        const predictBtn = document.getElementById('predictBtn');
        const loader = document.getElementById('loader');
        const resultContent = document.getElementById('resultContent');
        const priceValue = document.getElementById('priceValue');
        const priceSummary = document.getElementById('priceSummary');
        const priceChip = document.getElementById('priceChip');
        const errorBox = document.getElementById('error-box');
        const errormsg= document.getElementById('error-msg');

               

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

             const hp=parseFloat(document.getElementById('hp').value);
             const engine_size=parseFloat(document.getElementById('engine').value);
             const make= document.getElementById('make').value.trim();
             const year= parseInt(document.getElementById('year').value);
             const torque= parseFloat(document.getElementById('torque').value);
             const time_0_60= parseFloat(document.getElementById('time').value);

             let errormessage = ""

             if (year < 1965 || year > 2026) errorMessage = "Year must be between 1965 and 2026.";
            else if (engine < 1.3 || engine > 8.0) errorMessage = "Engine Size must be between 1.3L and 8.0L.";
            else if (hp < 200 || hp > 2100) errorMessage = "Horsepower must be between 200 and 2100.";
            else if (torque < 100 || torque >1500 ) errorMessage = "Torque must be between 10 and 1500 lb-ft.";
            else if (time < 1.5 ) errorMessage = "0-60 time must be start with 1.5.";

            if(errormessage){

                errormsg.textContent=errormessage;
                errormsg.style.display = 'block'
                errormsg.display='$0'
                return;

            }else{

                errormsg.style.display = 'none'

            }


            

            predictBtn.disabled = true;
            loader.style.display = 'block';
            resultContent.classList.remove('result-active');
            resultContent.classList.add('result-empty');
            errorBox.style.display = 'none';

            const payload = {
                make:make,
                year:year,
                engine_size: engine_size,
                hp: hp,
                torque: torque,
                time_0_60: time_0_60
            };

            try {

                const response = await fetch('http://127.0.0.1:8001/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok) {

                    resultContent.classList.remove('result-empty');
                    resultContent.classList.add('result-active');
                    priceValue.textContent = data.formatted_price;
                    priceChip.textContent = "Market Estimated Price";
                    priceSummary.textContent = `${payload.year} Model ${payload.make} Performance Profile`;
                } else {

                    throw new Error(data.detail || "Error processing valuation.");
                }
            } catch (err) {

                errorBox.textContent = "Service Error: " + err.message;
                errorBox.style.display = 'block';
            } finally {
                loader.style.display = 'none';
                predictBtn.disabled = false;
            }
        });