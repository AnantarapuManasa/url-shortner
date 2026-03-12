const ctx = document.getElementById('clickChart');

new Chart(ctx, {
type: 'line',
data: {
labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
datasets: [{
label: 'Clicks',
data: [5, 12, 8, 15, 10, 6, 9],
borderColor: '#6366f1',
backgroundColor: 'rgba(99,102,241,0.1)',
tension: 0.4
}]
},
options: {
responsive: true,
plugins:{
legend:{display:false}
}
}
});