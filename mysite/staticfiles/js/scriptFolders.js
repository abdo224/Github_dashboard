// we will put some code here later //    
import { Octokit, App } from "https://cdn.skypack.dev/octokit";

            

var data;

    document.getElementById("inpFile").addEventListener("change", e => {
            const reader = new FileReader();
            reader.onload = s => {
            console.log(s);
           
            data = s.target.result;
            }
            reader.readAsText(e.target.files[0]);
      
    });
    const myForm = document.getElementById("myForm");
    myForm.addEventListener("submit" ,async function(e) {
            e.preventDefault();
           

            let token = document.getElementById("token").value ; 

            var data_json = JSON.parse(data)
            var donnes = data_json.data
            
           
        
            var fetched_repos = []
            var fetched_folders = []
            const octokit  = new Octokit({
                auth: token
            })
            
            
            var globaly = document.getElementById('global')
        
            for(var i=0;i < donnes.length;i++){
                // get all repos
               
               
                var repo = await octokit.request('GET /repos/{owner}/{repo}',{
                    owner: donnes[i].owner,
                    repo: donnes[i].repo
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
                
                var repo2 = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}',{
                    owner: donnes[i].owner,
                    repo :donnes[i].repo,
                    path: donnes[i].path
                })
                console.log(repo2)
                
                
              
               
                    var folder = {
                        repo : repo_name,
                        folders_and_files : (repo2.data).length,
                       
                        path : donnes[i].path
                    }
                    fetched_folders.push(folder)
                

              
                
                
               
                fetched_folders.push(folder)
            }
            console.log(fetched_folders)
            var file_to_export = {}
            file_to_export["details"] = fetched_folders
            var final_file = JSON.stringify(file_to_export)
            var con = document.getElementById("folderContent")
            
            const download = function(data){
                const blob = new Blob([data],{ type: 'application/json' });
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.setAttribute('hidden','')
                a.setAttribute('href',url)
                a.setAttribute('download','folders.json')
                globaly.appendChild(a)
                a.click()
                globaly.removeChild(a)
                con.innerHTML = "Your file has been donwloaded succesfully"
            }
            download(final_file)
       
         
         })
          
           
            
    
            
 