
var nodemailer = require('nodemailer');
const nightmare = require('nightmare')()

const args = process.argv.slice(2)
const url = args[0]
const minPrice = args[1]

checkPrice();

async function checkPrice(){
    try {
        const priceString = await nightmare.goto(url)
            .wait('#priceblock_ourprice')
            .evaluate(()=> document.getElementById('priceblock_ourprice').innerText)
            .end()
        let actualPriceString = "";
        for(let i=0;i<priceString.length;i++){
            if((priceString[i]>='0' && priceString[i]<=9) || priceString[i]=='.') actualPriceString+=priceString[i];
        }
        const priceNumber = parseFloat(actualPriceString)
        console.log(priceNumber)
        if(priceNumber<minPrice){
            await transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            console.log('It is cheap')
        }
    } catch (error) {
        sendEmail('Amazon price checker error ', error.message)
        throw error
    }
    
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email',
      pass: 'your-password'
    }
  });
  
  var mailOptions = {
    from: 'your-email',
    to: 'recipient-email',
    subject: 'Price is Low',
    html: `The price on ${url} has dropped below ${minPrice}`
  };