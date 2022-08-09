// we will put some code here later //    
             import { Octokit, App } from "https://cdn.skypack.dev/octokit";
            
             var filer = document.getElementById("fileContent") ;
             var data;
             var start ;
             var end ;
                 document.getElementById("inpFile").addEventListener("change", e => {
                         const reader = new FileReader();
                         reader.onload = s => {
                         console.log(s);
                         filer.innerHTML  = s.target.result;
                         data = s.target.result;
                         }
                         reader.readAsText(e.target.files[0]);
                   
                 });
                 const myForm = document.getElementById("myForm");
                 myForm.addEventListener("submit" ,async function(e) {
                         e.preventDefault();
                         let start_date = (document.getElementById("start-date").value).split('-'); 
                         let end_date = (document.getElementById("end-date").value).split('-');
                         let from_date = new Date(parseInt(start_date[0]), parseInt(start_date[1])-1, parseInt(start_date[2]), 0, 0, 0, 0).toISOString();
                         let to_date = new Date(parseInt(end_date[0]), parseInt(end_date[1])-1, parseInt(end_date[2]), 23, 59, 59, 59).toISOString();
                         start = from_date ;
                         end = to_date;

                         let token = document.getElementById("token").value ; 

                         var data_json = JSON.parse(data)
                         var donnes = data_json.data
                         
                        
                     
                         var fetched_repos = []
                         var repo_commits = {}
                         var owners = []
                         const octokit  = new Octokit({
                             auth: token
                         })
                         
                         
                         var globaly = document.getElementById('global')
                     
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
                                 repo_commits[repo_name].push(commits.data) 
                             
                        }
                       }
                       console.log(fetched_repos)
                       console.log(repo_commits)
                           
                           
                           

                         
                         
                        
                         
                         var L = fetched_repos.length;
                         var tab = document.getElementById('table')
                          //show commits per repo
                          var canvas = document.getElementById('Mychart').getContext('2d')
                         for(let i=0;i<L;i++){
                             var row = document.createElement('tr')
                             row.setAttribute('class','toClear')
                             var row_data_1 = document.createElement('td')
                             row_data_1.innerHTML = fetched_repos[i].repo
                             var row_data_2 = document.createElement('td')
                             row_data_2.setAttribute('id','create')
                             row_data_2.innerHTML = fetched_repos[i].created_at
                             var row_data_3 = document.createElement('td')
                             var a = document.createElement('a');
                             a.appendChild(document.createTextNode('Details'))
                             var ctx = document.createElement('canvas')
                             var config = {}
                             var charts = new Chart(ctx, config)
                             a.href = '#'
                             a.onclick = function handle(){
                                 charts.destroy()
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
                                 
                             }
                             row_data_3.appendChild(a);
                             row.appendChild(row_data_1)
                             row.appendChild(row_data_2)
                             row.appendChild(row_data_3)
                             tab.appendChild(row)
                             
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
                          filer.innerHTML = ''
                         })

                         
                 })
                 
