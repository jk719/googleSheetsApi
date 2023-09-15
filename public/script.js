function submitData() {
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;

    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, age })
    })
    
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text().then(text => {
            return text ? JSON.parse(text) : {}
        });
    })
    .then(data => {
        document.getElementById("result").innerText = `Name: ${data.name}, Age: ${data.age}`;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

