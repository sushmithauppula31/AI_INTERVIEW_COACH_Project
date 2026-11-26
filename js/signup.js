document.getElementById("signupForm").addEventListener("submit",function(e){
 e.preventDefault();

 const name=document.getElementById("name").value.trim();
 const email=document.getElementById("email").value.trim().toLowerCase();
 const password=document.getElementById("password").value;
 const confirmPassword=document.getElementById("confirmPassword").value;
 const message=document.getElementById("message");

 if(password!==confirmPassword){
  message.style.color="#ff8b9b";
  message.textContent="Passwords do not match.";
  return;
 }

 let accounts=JSON.parse(localStorage.getItem("preppilot_accounts")||"[]");

 if(accounts.some(account=>account.email===email)){
  message.style.color="#ff8b9b";
  message.textContent="An account with this email already exists.";
  return;
 }

 accounts.push({name,email,password});
 localStorage.setItem("preppilot_accounts",JSON.stringify(accounts));

 sessionStorage.setItem("preppilot_logged_in","true");
 sessionStorage.setItem("preppilot_user",email);

 window.location.href="index.html";
});
