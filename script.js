
// script.js - handles 2-step payment & join flow with UTR submit
const upiId = "6005099281@mbk";
const telegramLink = "https://t.me/+your_vip_group_link";

// helpers
const $ = (s) => document.querySelector(s);

// Modal functions
function showModal(html, opts) {
  opts = opts || {showPay:false};
  const modal = document.getElementById('modal');
  document.getElementById('modalBody').innerHTML = html;
  document.getElementById('modal').setAttribute('aria-hidden','false');
  document.getElementById('modalPay').style.display = opts.showPay ? 'inline-block' : 'none';
}
function closeModal() {
  document.getElementById('modal').setAttribute('aria-hidden','true');
}

// Toast / live notify
function showToast(msg, time) {
  time = time || 3000;
  const el = document.getElementById('liveNotify');
  el.innerHTML = msg;
  el.classList.add('show');
  setTimeout(()=> el.classList.remove('show'), time);
}

// Fake live join notifications (30-40 members style)
const names = ['Rahul','Amit','Sneha','Priya','Arjun','Kiran','Sahil','Anjali','Rohit','Pooja'];
function showJoinNotification() {
  const name = names[Math.floor(Math.random()*names.length)];
  const joined = Math.floor(Math.random()*11) + 30; // 30-40
  showToast('✨ ' + name + ' just joined! (' + joined + ' members now)' , 4500);
}
setInterval(showJoinNotification, 7000);

// copy upi
document.addEventListener('DOMContentLoaded', function(){
  var copyBtn = document.getElementById('copyUpi');
  if(copyBtn){
    copyBtn.addEventListener('click', function(){
      navigator.clipboard.writeText(upiId).then(function(){
        showToast('UPI ID copied to clipboard');
      }).catch(function(){ showToast('Could not copy UPI ID'); });
    });
  }

  // Start join: show payment modal
  var startBtn = document.getElementById('startJoin');
  if(startBtn){
    startBtn.addEventListener('click', function(){
      var html = '<h3>पहले पेमेंट करें — ₹150</h3>' +
                 '<p>Payment UPI ID: <strong>' + upiId + '</strong></p>' +
                 '<p>Scan QR or open your UPI app. फिर UTR दर्ज कर दें।</p>';
      showModal(html, {showPay:true});
    });
  }

  // modal buttons
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOk').addEventListener('click', closeModal);
  document.getElementById('modalPay').addEventListener('click', function(){ closeModal(); document.getElementById('payment').scrollIntoView({behavior:'smooth'}); });

  // Paid button opens/scrolls to payment section
  var paidBtn = document.getElementById('paidBtn');
  if(paidBtn){
    paidBtn.addEventListener('click', function(){ document.getElementById('payment').scrollIntoView({behavior:'smooth'}); showToast('Open your UPI app and pay ₹150. Then submit UTR below.'); });
  }

  // UTR form submit logic (stored in localStorage)
  var utrForm = document.getElementById('utrForm');
  if(utrForm){
    utrForm.addEventListener('submit', function(e){
      e.preventDefault();
      var utr = document.getElementById('utr').value.trim();
      if(!utr) return;
      var record = {utr:utr, time: new Date().toISOString()};
      localStorage.setItem('zash_utr', JSON.stringify(record));
      document.getElementById('utrMsg').innerText = '✅ UTR ' + utr + ' submitted! Awaiting verification.';
      showToast('UTR submitted. Wait for verification.');
    });
  }

  // Clear UTR
  var clearBtn = document.getElementById('clearUtr');
  if(clearBtn){
    clearBtn.addEventListener('click', function(){ localStorage.removeItem('zash_utr'); document.getElementById('utr').value = ''; document.getElementById('utrMsg').innerText = ''; showToast('UTR cleared'); });
  }

  // Join Channel button - checks if UTR submitted & verified flag
  var joinBtn = document.getElementById('joinChannel');
  if(joinBtn){
    joinBtn.addEventListener('click', function(){
      var stored = localStorage.getItem('zash_utr');
      if(!stored){
        showModal('<h3>💡 Payment required</h3><p>पहले ₹150 का पेमेंट करें और UTR डालें, तभी आप चैनल जॉइन कर पाएंगे।</p>', {showPay:true});
        return;
      }
      var rec = JSON.parse(stored);
      // In this static site we can't verify payments automatically.
      // Show a message that UTR is received and awaiting manual verification.
      showModal('<h3>UTR Received</h3><p>हमने आपका UTR <strong>' + rec.utr + '</strong> रसीव कर लिया है। कृपया प्रतीक्षा करें — verification होने पर आपको शामिल किया जाएगा।</p>', {showPay:false});
    });
  }

  // accessibility: close modal on ESC
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });

});
