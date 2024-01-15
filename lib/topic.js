var db = require(`./db`);
var template = require('./template');
var url = require('url');
var qs = require('querystring');

/* 홈페이지 */
exports.home = function(response){
  db.query(`SELECT * FROM topic`, function(error, topics){
    if(error){
      throw error;
    }
  
    var title = 'Welcome';
    var description = 'Hello, Node.js';
  
    var list = template.list(topics);
    var html = template.HTML(title, list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
    );
    response.writeHead(200);
    response.end(html);
  });
}

/* 글 상세 페이지 */
exports.page = function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  
  /* 글목록 만들기  */
  db.query(`SELECT * FROM topic`, function(error, topics){
    if(error){
      throw error;    
    }

    /* 쿼리스트링 id에 맞는 db값만 가져오기 */
    db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id],(error2, topic)=>{
      if(error2){
        throw error2;
      }
      
      var title = topic[0].title;
      var description = topic[0].description;
  
      var list = template.list(topics);
      var html = template.HTML(title, list,
        `<h2>${title}</h2>
        ${description}
        <p>by ${topic[0].name}</p>`
        ,
        `<a href="/create">create</a>
        <a href="/update?id=${queryData.id}">update</a>
        <form action="delete_process" method="post">
          <input type="hidden" name="id" value="${queryData.id}">
          <input type="submit" value="delete">
        </form>`
      );
      response.writeHead(200);
      response.end(html);
    })
  });
}

/* create 링크 눌렀을 때 페이지 */
exports.create = function(request, response){

  db.query('SELECT * FROM topic', (error, topics)=>{
    db.query(`SELECT * FROM author`, (error2, authors)=>{
      
      var title = `Create`;
      var list = template.list(topics);
      var html = template.HTML(title, list, `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            ${template.authorSelect(authors)}
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `, '<a href="/create">create</a>');
      response.writeHead(200);
      response.end(html);
    })
  })
}

/* create 버튼 눌렀을 때 처리 후 redirect 페이지 */
exports.create_process = function(request, response){
  var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);

          db.query('INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)',
          [post.title, post.description, post.author], (error, result)=>{
            if(error){
              throw error;
            }
            else{
              response.writeHead(302, {Location: `/?id=${result.insertId}`});
              response.end();
            }
          })
      });
}

/* update 링크 눌렀을 때 페이지  */
exports.update = function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query(`SELECT * FROM topic`, (error, topics)=>{
        
    if(error){
      throw error;
    }
    db.query(`SELECT * FROM author`, (error3, authors)=>{
      db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id],(error2, topic)=>{
        if(error2){
          throw error2;
        }
        
        var list = template.list(topics);
        var html = template.HTML(topic[0].title, list,
          `
          <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${topic[0].id}">
            <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
            <p>
              <textarea name="description" placeholder="description">${topic[0].description}</textarea>
            </p>
            <p>
              ${template.authorSelect(authors, topic[0].author_id)}
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
          `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
        );
        response.writeHead(200);
        response.end(html);

        
      })
    })
    
  });
}

/* update 버튼 눌렀을 때 처리 후 redirect 페이지 */
exports.update_process = function(request, response){
  var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);

          db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,[post.title, post.description, post.author, post.id], (error, result)=>{
            
            if(error){
              throw error;
            }
            else{
              response.writeHead(302, {Location: `/?id=${post.id}`});
              response.end();
            }
          })
      });
}

/* delete 버튼 눌렀을 때 처리 후 홈페이지 */
exports.delete = function(request, response){
  var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);

          db.query(`DELETE FROM topic WHERE id=?`, [post.id], (error, result)=>{
            if (error){
              throw error;
            }
            response.writeHead(302, {Location: `/`});
            response.end();
          });
      });
}