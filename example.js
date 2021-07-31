const express = require('./myExpress')
const app = express()
const port = 3000


app.use('/middle', (req,res,next) => {
  console.log("我是中间价");
  next("我跑出了错误");
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
app.use((err,req,res,next)=> {
  console.log("我是错误中间件");
  next()
})
app.use((req,res,next) => {
  console.log("我是错误中间件后面的中间件，我是会");
  next();
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
