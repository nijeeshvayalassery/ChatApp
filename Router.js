module.exports=function(app)
{
app.get('/',function(req,res){
//res.render('Home.html');

sess=req.session;
if (sess.email) {
    console.log('Hiiiiiiiiiii  '+Cusers)
    //res.render('Home',{Name:sess.name,AllUsers:Cusers})
    res.render('Home',{Name:sess.name,AllUsers:Cusers})
}else{
    console.log('Sess Epty')
    res.render('Login')
}
});
app.get('/about',function(req,res){
//res.render('About.html');
res.render('About');
});
}