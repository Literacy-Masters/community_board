var http = require('http');
var url = require('url');
// var qs = require('querystring');
var topic = require(`./lib/topic`);
var author = require(`./lib/author`);

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/'){
      /* 쿼리 스트링이 없는경우 === 홈페이지 버튼 눌렀을 때 */
      if(queryData.id === undefined){
      topic.home(response);
      }
      /* 쿼리스트링이 있는 경우임. (즉 리스트 목록을 클릭했을떄) */
      else {
        topic.page(request, response);
      }
    }

    /* Create 링크만 눌렀을 때  */
    else if(pathname === '/create'){
      topic.create(request, response);
    }
    
    /* Create 누르고 버튼까지 눌렀을 때 */
    else if(pathname === '/create_process'){
      topic.create_process(request, response);
    }
    
    /*  update 링크만 눌렀을 때 */
    else if(pathname === '/update'){
      topic.update(request, response);
    }
    
    /* 업데이트 프로세스 */
    else if(pathname === '/update_process'){
      topic.update_process(request, response);
    }
    /* 삭제 프로세스 */
    else if(pathname === '/delete_process'){
      topic.delete(request, response);
    }
    else if(pathname === '/author'){
      author.home(request, response);
    }
    else if(pathname === '/author/create_process'){
      author.create_process(request, response);
    }
    
    else if(pathname === '/author/update'){
      author.update(request, response);
    }
    
    else if(pathname === '/author/update_process'){
      author.update_process(request, response);
    }
    
    else if(pathname === '/author/delete_process'){
      author.delete_process(request, response);
    }
    /* 모르는 쿼리 스트링이 들어왔을때 -> 404 Not found 에러표시  */
    else {
      response.writeHead(404);
      response.end('Not found');
    }

});
app.listen(3000);
