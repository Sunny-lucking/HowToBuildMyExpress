const express = require('./myExpress')
const app = express()
const port = 3000


app.use('/middle', (req,res,next) => {
  console.log("我是中间价");
  next();
  
})
app.use((req,res,next) => {
  console.log("我是没有路由的中间价");
  next();
})
app.post('/middle', (req,res) => {
  res.end(' aha,nihao')
})
app.use((req,res,next) => {
  console.log("我写在路由后面，我是不会执行的");
  next();
})
app.all('*',(req,res) => {
  res.end(' wo shi all');
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
