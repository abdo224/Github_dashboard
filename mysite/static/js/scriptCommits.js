    
             import { Octokit, App } from "https://cdn.skypack.dev/octokit";
             
            
             

            
             //var filer = document.getElementById("fileContent") ;
             var data;
             var start ;
             var end ;
                 document.getElementById("inpFile").addEventListener("change", e => {
                         const reader = new FileReader();
                         reader.onload = s => {
                         console.log(s);
                         //filer.innerHTML  = s.target.result;
                         data = s.target.result;
                         }
                         reader.readAsText(e.target.files[0]);
                   
                 });
                 const myForm = document.getElementById("myForm");
                 
                 
                 myForm.addEventListener("submit" ,async function(e) {
                         e.preventDefault();
                    try{ 
                         let start_date = (document.getElementById("start-date").value).split('-'); 
                         let end_date = (document.getElementById("end-date").value).split('-');
                         let from_date = new Date(parseInt(start_date[0]), parseInt(start_date[1])-1, parseInt(start_date[2]), 0, 0, 0, 0).toISOString();
                         let to_date = new Date(parseInt(end_date[0]), parseInt(end_date[1])-1, parseInt(end_date[2]), 23, 59, 59, 59).toISOString();
                         start = from_date ;
                         end = to_date;
                        
                         
                         var data_json = JSON.parse(data)
                         var donnes = data_json.data

                         let token = document.getElementById("token").value ;
                        
                        
                         

                         var fetched_repos = []
                         var repo_commits = {}
                         var repo_commits_peruser = {}
                     
                         const octokit  = new Octokit({
                             auth: token
                         })
                         
                         
                         var globaly = document.getElementById('global')
                         var clos = document.getElementById('close')
                         var overlay = document.getElementById('overlay')
                     
                         for(var i=0;i < donnes.length;i++){
                             // get all repos
                            var L = (donnes[i].repos).length 
                            for(let j=0;j<L;j++){
                             var repo = await octokit.request('GET /repos/{owner}/{repo}',{
                                 owner: donnes[i].owner,
                                 repo: (donnes[i].repos)[j]
                             })
                             var repo_name = repo.data.name
                             var repo_url = repo.data.svn_url
                             var repo_created = repo.data.created_at
                             var repo_object = {
                                 repo: repo_name,
                                 url: repo_url,
                                 created_at: repo_created
                             }
                             fetched_repos.push(repo_object)
                             repo_commits[repo_name] = []
                             const commits = await octokit.request('GET /repos/{owner}/{repo}/commits',{
                                     owner: donnes[i].owner,
                                     repo: (donnes[i].repos)[j],
                                     since: start,
                                     until: end,
                                     per_page: 100
                                 })
                                 repo_commits[repo_name].push((commits.data))
                               
                                
                                  
                             
                        }
                       }
                       console.log(repo_commits)
                      
                       for(let key in repo_commits){    
                            for(let i=0;i<repo_commits[key][0].length;i++){
                                var comm = repo_commits[key][0][i]
                                if(repo_commits_peruser[comm.commit.author.name]){
                                    repo_commits_peruser[comm.commit.author.name]++
                                }else {
                                    repo_commits_peruser[comm.commit.author.name] = 1
                                }
                                
                            }
                       }
                    
                        
                    
                        console.log(repo_commits_peruser)   
                        // show commit per user 
                        var labels = []
                        var dataCharts = []             
                        for(let key in repo_commits_peruser){
                            labels.push(key)
                            dataCharts.push(repo_commits_peruser[key])
                          }
                          
                      
                             
                         var L = fetched_repos.length;
                         var tab = document.getElementById('table')
                          //show commits per repo
                          var canvas = document.getElementById('Mychart').getContext('2d')
                          var ctx = document.createElement('canvas')
                          var config = {}
                          var charts = new Chart(ctx, config)
                          var row2 = document.getElementById('per_user')
                         for(let i=0;i<L;i++){
                             var row = document.createElement('tr')
                             var row_data_1 = document.createElement('td')
                             var row_data_2 = document.createElement('td')
                             var row_data_3 = document.createElement('td')
                            
                             row.setAttribute('class','toClear')
                             var a = document.createElement('a');
                           
                             row_data_1.innerHTML = fetched_repos[i].repo
                            
                             row_data_2.setAttribute('id','create')
                             row_data_2.innerHTML = fetched_repos[i].created_at
                             
                           
                             a.appendChild(document.createTextNode('Details'))
                             
                             a.href = '#'
                             a.onclick = function handle(e){
                                 e.preventDefault()
                                 charts.destroy()
                                 var model = document.getElementById('model')
                                 charts = new Chart(canvas,{
                                     type:'bar',
                                     data : {
                                         labels : [fetched_repos[i].repo],
                                         datasets : [
                                             {
                                                 label : 'Commits',
                                                 data : [repo_commits[(fetched_repos[i].repo)][0].length],
                                                 backgroundColor : 'rgb(55,140,255)',
                                                 borderWidth : 1 ,
                                                 borderColor: '#777',
                                                 hoverBorderWidth : 3,
                                                 hoverBorderColor : '#000'
                                             }
                                         ]

                                     }
                                 })
                                 if(model == null) return 
                                 model.classList.add('active')
                                 overlay.classList.add('active')
                                 overlay.addEventListener('click', () =>{
                                    const modals = document.querySelectorAll('.model.active')
                                    modals.forEach(modal => {
                                    if(modal == null) return 
                                    modal.classList.remove('active')
                                    overlay.classList.remove('active')
                                    })
                                        
                                    });
                                 
                                 clos.addEventListener('click', () => {
                                    if(model == null) return 
                                    model.classList.remove('active')
                                    overlay.classList.remove('active')
                                 })

                                 
                             }
                             row_data_3.appendChild(a);
                             row.appendChild(row_data_1)
                             row.appendChild(row_data_2)
                             row.appendChild(row_data_3)
                             tab.appendChild(row)
                             
                         }
                         var a2 = document.createElement('a');
                         a2.setAttribute('id','center')
                         a2.appendChild(document.createTextNode('Commits Per User'))
                         a2.href = '#'
                         a2.onclick = function handle2(e){
                            e.preventDefault()
                            charts.destroy()
                                 charts = new Chart(canvas,{
                                     type:'bar',
                                     data : {
                                         labels : labels,
                                         datasets : [
                                             {
                                                 label : 'Commits',
                                                 data : dataCharts,
                                                 backgroundColor : 'rgb(55,140,255)',
                                                 borderWidth : 1 ,
                                                 borderColor: '#777',
                                                 hoverBorderWidth : 3,
                                                 hoverBorderColor : '#000'
                                             }
                                         ]

                                     }
                                 })
                                 if(model == null) return 
                                 model.classList.add('active')
                                 overlay.classList.add('active')
                                 overlay.addEventListener('click', () =>{
                                    const modals = document.querySelectorAll('.model.active')
                                    modals.forEach(modal => {
                                    if(modal == null) return 
                                    modal.classList.remove('active')
                                    overlay.classList.remove('active')
                                    })
                                        
                                    });
                                 
                                 clos.addEventListener('click', () => {
                                    if(model == null) return 
                                    model.classList.remove('active')
                                    overlay.classList.remove('active')
                                 })

                         }
                       
                        if(dataCharts !== []){
                         var tab2 = document.createElement('table')
                         tab2.setAttribute('id','table2')
                         var tr2 = document.createElement('tr')
                         var td2 = document.createElement('td')
                         td2.appendChild(a2)
                         tr2.appendChild(td2)
                         tab2.appendChild(tr2)
                         globaly.appendChild(tab2)
                        }
                         var tr = document.getElementsByClassName('toClear')
                         var cn = document.getElementById('Mychart');
                         var clear = document.getElementById('clicki')
                         clear.addEventListener("click", function(e) {
                             e.preventDefault()
                             for(let i=0;i<tr.length;i++){
                                 tr[i].innerHTML = ''
                             }
                          charts.destroy()
                          cn.innerHTML = ''
                        
                          a2.innerHTML = ''
                          tab2.innerHTML = ''
                          td2.removeChild(a2)
                          tr2.removeChild(td2)
                          tab2.removeChild(tr2)
                          globaly.removeChild(tab2)
                       
                          
                         })
                    }catch(e){
                        var err = e.toString()
                        swal('Ooops!',err,'error')
                    } 

                       
                 })
                 
