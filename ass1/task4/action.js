const firstname = document.getElementById('firstname');
const lastname = document.getElementById('lastname');
const birthday = document.getElementById('birthday');
const select = document.getElementById('favcheese');
const remove = document.getElementById('remove');
const output =  document.getElementById('output');

var today = new Date();

const city1 = document.getElementById('city1');
const city2 = document.getElementById('city2');
const city3 = document.getElementById('city3');
const city4 = document.getElementById('city4');

function convert_date(date) {
    let day = date.substr(0, 2);
    let month = date.substr(3, 2);
    let year = date.substr(6, 4);
    let d = new Date(Date.parse(year + '-' + month + '-' + day));
    return d;
}

function birthday_is_valid(date) {
    /*date input is empty*/
    if (date == '') {
        return false;
    }
    /*check date format*/
    let re = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
    if (!re.test(date)) {
        return false;
    }
    /*check if date is NaN*/
    let new_date = convert_date(date);
    if (isNaN(new_date)) {
        return false;
    }
    return true;
}

function name_is_valid(name) {
    if (name.length >= 3 && name.length <= 50) {
        return true;
    }
    return false;
}

function render_page() {
    /*using a year of 365.25days because of leap years*/
    let age = Math.floor((today - convert_date(birthday.value).getTime())/3.15576e+10);
        
    let cheese = select.options[select.selectedIndex].value;
        
    let temp = 'Hello ' + firstname.value + ' ' + lastname.value + ', you are ' + age + ' years old, your favourite cheese is ' + cheese + ' and you\'ve lived in ';

    let cities = [];
    if (document.getElementById('city1').checked) {
        cities.push(city1.value);
    }
    if (document.getElementById('city2').checked) {
        cities.push(city2.value);
    }
    if(document.getElementById('city3').checked) {
        cities.push(city3.value);
    }
    if(document.getElementById('city4').checked) {
        cities.push(city4.value);
    }

    if (cities.length == 0) {
        output.value = temp + 'no cities.';
    } else {
        for (let i = 0; i < cities.length; i++) {
            if (i == cities.length - 1) {
                temp += cities[i] + '.';
            } else {
                temp += cities[i] + ', ';
            }
        }
        output.value = temp;
    }
}

function check_input() {
    if (!name_is_valid(firstname.value)) {
        output.value = 'Do not enter an invalid firstname';
    } else {
        if (!name_is_valid(lastname.value)) {
            output.value = 'Do not enter an invalid lastname';
        } else {
            if (!birthday_is_valid(birthday.value)) {
                output.value = 'Do not enter an invalid date of birth';
            } else {
                render_page();
            }
        }
    }
}

firstname.addEventListener('blur', (event) => {
    check_input();
});

lastname.addEventListener('blur', (event) => {
    check_input();
});

birthday.addEventListener('blur', (event) => {
    check_input();
});

select.addEventListener('change', (event) => {
    check_input();
});

document.getElementById('checkboxes').addEventListener('change', (event) => {
    check_input();
});

remove.addEventListener('click', (event) => {
    document.getElementById('info-form').reset();
    output.value = '';
    event.preventDefault();
});
