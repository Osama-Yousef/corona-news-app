// requirement 
require('dotenv').config();

// dependencies 

const pg=require('pg');
const express=require('express');
const methodOverride=require('method-override');
const cors=require('cors');
const superagent=require('superagent');

// main variables 

const PORT= process.env.PORT || 3030 ;
const client = new pg.Client(process.env.DATABASE_URL);
const app = express();

// uses 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public')); 
app.set('view engine', 'ejs');
// app.use('*',notFoundHandler);
// app.use(errorHandler);

// listen to port 

client.connect().then(()=>{

app.listen(PORT, ()=>{
    console.log(`listening on PORT ${PORT}`);
})

})
////////////////////////////////////////

// // check

// app.get('/',homeHandler);

// function homeHandler(req,res){
//     res.status(200).send('it works');
// }
// //////////////////////////////////

// route definition

app.get('/',homeHandler);

app.get('/addToDb',addToDbHandler);

app.get('/selectData', selectDataHandler);

app.get('/details/:news_id',detailsHandler);

app.put('/update/:update_id',updateHandler);

app.delete('/delete/:delete_id',deleteHandler);


// route handlers 

function homeHandler(req,res){

let url=`http://newsapi.org/v2/everything?q=covid19&sortBy=publishedAt&apiKey=${process.env.NEWS_KEY}`;

superagent.get(url).then(data=>{

let newsArray = data.body.articles.map(val=>{

return new News (val);

})

res.render('index',{data:newsArray});

})

}


///////// constructor function

function News(val){

this.title=val.title || 'no title' ;
this.author=val.author || 'no author';
this.image=val.urlToImage || 'no image';
this.description=val.description || 'no description' ;

}


//////////////////////////

function addToDbHandler(req,res){

// collect 
let { title,author,image,description} = req.query ;

let sql=`INSERT INTO newsTable (title,author,image,description) VALUES ($1,$2,$3,$4) ;`;

let safeValues=[title,author,image,description] ;

client.query(sql,safeValues).then(()=>{

res.redirect('/selectData');

})

}

////////////////////////////////////////////////////

function selectDataHandler(req,res){

let sql=`SELECT * FROM newsTable ;`;

client.query(sql).then(result=>{

    res.render('pages/favorite',{data:result.rows});
    
    })

}

//////////////////////////////////////////////////

function detailsHandler(req,res){

let param=req.params.news_id;

let sql=`SELECT * FROM newsTable WHERE id=$1 ;`;

let safeValues=[param];


client.query(sql,safeValues).then(result=>{

    res.render('pages/details',{data:result.rows[0]});
    
    })

}

/////////////////////////////////////////////////////

function updateHandler(req,res){

    let param=req.params.update_id;

    let { title,author,image,description} = req.body ;

let sql=`UPDATE newsTable SET title=$1,author=$2,image=$3,description=$4 WHERE id=$5 ;`;

let safeValues=[title,author,image,description,param] ;


client.query(sql,safeValues).then(()=>{

    res.redirect(`/details/${param}`);
    
    })


}


//////////////////////////////////////////////////


function deleteHandler(req,res){

    let param=req.params.delete_id;


let sql=`DELETE FROM newsTable WHERE id=$1 ;`;

let safeValues=[param] ;


client.query(sql,safeValues).then(()=>{

    res.redirect('/selectData');
    
    })


}


// /////////////////////////////// 
// /// error handler 
// function errorHandler(req,res){
//     res.status(500).send(err);

// }

// /// not found handler

// function notFoundHandler(req,res){
//     res.status(404).send('page not found ');

// }