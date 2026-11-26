document.getElementById("loginForm").addEventListener("submit",function(e){
 e.preventDefault();

 const email=document.getElementById("email").value.trim().toLowerCase();
 const password=document.getElementById("password").value;
 const accounts=JSON.parse(localStorage.getItem("preppilot_accounts")||"[]");

 const user=accounts.find(account=>
  account.email===email && account.password===password
 );

 if(user){
  sessionStorage.setItem("preppilot_logged_in","true");
  sessionStorage.setItem("preppilot_user",email);
  window.location.href="index.html";
 }else{
  document.getElementById("message").textContent=
   "Invalid email or password. Please try again.";
 }
});
