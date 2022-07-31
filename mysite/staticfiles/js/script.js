//function init() {
  var testing = 'jjj'
  console.log('aa')
  let filer = document.getElementById("fileContent") ;
  let data;
    document.getElementById("inpFile").addEventListener("change", e =>  {
            const reader = new FileReader();
            reader.onload = s => {
                console.log(s);
               filer.innerHTML  = s.target.result;
               data = s.target.result;
            }
            reader.readAsText(e.target.files[0]);
  

    });

    
    const myForm = document.getElementById("myForm");
    myForm.addEventListener("submit" , e => {
    e.preventDefault();
    const start_date = document.getElementById("start-date").value ; 
    const end_date = document.getElementById("end-date").value;
    const token = document.getElementById("token").value ; 
     console.log(start_date);
     console.log(end_date);
     console.log(token);
     console.log(data)
});

//}

