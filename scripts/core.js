// fetch("https://openapi.programming-hero.com/api/peddy/categories")
// .then(res => res.json())
// .then(json => console.log(json))

// 
const fetchAllPets = async (fetchPets = false) => {
  console.log()
  const res = await fetch(`https://openapi.programming-hero.com/api/peddy/pets`);
  const all_data = await res.json();
  const { pets } = all_data
  if (fetchPets) {
    pets.sort((a, b) => a.price - b.price)
  }
  petArea.innerHTML = ``
  for (const info of pets) {
    const { petId, breed, price, date_of_birth, image, gender, pet_name } = info;
    petMaker(petId, breed, price, date_of_birth, image, gender, pet_name);
  }

}

const fetchCategories = async () => {
  const res = await fetch("https://openapi.programming-hero.com/api/peddy/categories");
  const data = await res.json();
  const { categories } = data
  for (const info of categories) {
    const { id, category, category_icon } = info;
    categoryMaker(id, category, category_icon);
  }

}

const fetchPets = async (category, is_sort = false) => {
  console.log(category)
  const res = await fetch(`https://openapi.programming-hero.com/api/peddy/category/${category}`);
  const all_data = await res.json();
  const { data } = all_data

  if (is_sort) {
    data.sort(function (a, b) {
      return a.price - b.price
    })
  }

  petArea.innerHTML = ``
  if (Object.keys(data).length === 0) {
    petArea.innerHTML += `
        <div class="col-span-full flex flex-col justify-center text-center py-20 w-10/12 mx-auto align-middle">
                  <div class="mt-4">
                    <img src="./images/error.webp" class="mx-auto" alt="">
                  </div>
                  <h1 class="mt-6 mb-4 text-3xl font-bold">No Information Avaliable</h1>
                  <p>We apologize, but the information you are looking for is currently unavailable. Please check back later.</p>
                </div>
        `
  }
  else {
    for (const info of data) {
      const { petId, breed, price, date_of_birth, image, gender, pet_name } = info;
      petMaker(petId, breed, price, date_of_birth, image, gender, pet_name);
    }
  }
}

function categoryMaker(id, category, category_icon) {
  const card = `
    <button onclick="showCategory(${id}, '${category}')" class="btn btn-outline h-auto border-slate-300" id="cat_btn_${id}">
              <div class="p-6 flex items-center gap-4">
                <img class="object-cover" src="${category_icon}" alt="">
               <p class="text-2xl font-bold">${category}</p> 
              </div>
            </button>
    `
  categoryArea.innerHTML += card
}

function petMaker(petId, breed, price, date_of_birth, image, gender, pet_name) {

  breed = breed || 'Unknown';
  price = price || 'Unknown';
  date_of_birth = date_of_birth || 'Unknown';
  gender = gender || 'Unknown';
  pet_name = pet_name || 'Unknown';

  const card = `
    <div class="card bg-base-100 shadow-xl p-4 h-104" id="pet_${petId}">
        <figure class="h-56 overflow-hidden flex items-center justify-center">
            <img id="pet-image-${petId}"
                src="${image}"
                alt="Pet"
                class="h-full w-auto object-cover" />
        </figure>
        <div class="mt-6 flex flex-col gap-y-2">
            <h2 class="card-title">${pet_name}</h2>
            <div class="flex items-center gap-2">
                <i class="fa-solid fa-table"></i>
                <p>Breed: ${breed}</p>
            </div>
            <div class="flex items-center gap-2">
                <i class="fa-regular fa-calendar"></i>
                <p>Birth: ${date_of_birth}</p>
            </div>
            <div class="flex items-center gap-2">
                <i class="fa-solid fa-dollar-sign"></i>
                <p>Gender: ${gender}</p>
            </div>
            <div class="flex items-center gap-2 mb-4">
                <i class="fa-solid fa-mercury"></i>
                <p>Price: ${price} $</p>
            </div>
            <hr>
            <div class="flex justify-between mt-4">
                <button onclick="likedPet(${petId})" class="btn btn-outline">
                    <i class="fa-regular fa-thumbs-up"></i>
                </button>
                <label for="my_modal_6" class="btn btn-outline" id="adopt-btn-${petId}" onclick="adoptPet(${petId})">Adopt</label>
                <button onclick="dummy(${petId})" class="btn btn-outline">Details</button>
            </div>
        </div>
    </div>
`;
  petArea.innerHTML += card
}

function showCategory(pew, genre) {
  // bg-emerald-50 border-emerald-600
  if (currentCategory === pew) {
    return 0;
  }
  currentCards = genre.toLowerCase()
  const id = "cat_btn_" + pew
  const active_catagory = document.getElementById(id).classList
  active_catagory.add("bg-emerald-50", "border-emerald-600", "rounded-full")
  getPets(currentCards)

  if (toggleCategoty) {
    toggleCategoty.remove("border-emerald-600", "bg-emerald-50", "rounded-full")
  }
  toggleCategoty = active_catagory
  currentCategory = pew

}


function likedPet(id) {
  const imgUrl = document.getElementById("pet-image-"+id).src
  const imageBox = document.getElementById("liked-image-box")
  imageBox.innerHTML+=`
  <img src="${imgUrl}" alt="" class="mx-auto">
  `
}

function adoptPet(id) {
  let timer = 2
  document.getElementById("modal-counter").innerText = 3;
  // opacity-50 cursor-not-allowed pointer-events-none
  const btn = document.getElementById("adopt-btn-" + id).classList
  btn.add("opacity-50", "cursor-not-allowed", "pointer-events-none")
  document.getElementById("adopt-btn-" + id).innerText="Adopted"
  const intervalId = setInterval(() => {
    if (timer > 0) {
      document.getElementById("modal-counter").innerText = timer;
      timer -= 1;
    } else {
      document.getElementById("modal-counter").innerText = "Congrats 🎉";
      clearInterval(intervalId);
    }
  }, 1000);
}

function detailPet(id) {

}

function getPets(catagory_no) {
  petArea.innerHTML = `
    <div class="col-span-full h-96 content-center">
                  <div class="loader mx-auto "></div>
                </div>
    `
  setTimeout(() => {
    fetchPets(catagory_no)
  }, 2000);
}

function sort_catgory() {
  console.log(currentCards)
  if (!currentCards) {
    fetchAllPets(true)
  }
  else {
    fetchPets(currentCards, true)
  }
}

async function dummy(id) {
  const res = await fetch(`https://openapi.programming-hero.com/api/peddy/pet/${id}`);
  const all_data = await res.json();
  const { petData } = all_data;

  let { petId, breed, price, category, date_of_birth, image, gender, pet_name, pet_details, vaccinated_status } = petData;

  petId = petId || 'Unknown';
  breed = breed || 'Unknown';
  price = price || 'Unknown';
  category = category || 'Unknown';
  date_of_birth = date_of_birth || 'Unknown';
  image = image || 'Unknown';
  gender = gender || 'Unknown';
  pet_name = pet_name || 'Unknown';
  pet_details = pet_details || 'Unknown';
  vaccinated_status = vaccinated_status || 'Unknown';


  console.log(petId, breed, price, category, date_of_birth, image, gender, pet_name, pet_details, vaccinated_status);




  document.getElementById("my_modal_1").innerHTML = `
  <div class="modal-box">
  <div class="card  p-4">
                  <figure>
                    <img
                    
                      src="${image}"
                      alt="Shoes" />
                  </figure>
                  <div class="mt-6 flex flex-col gap-y-2 ">
                    <h2 class="card-title">${pet_name}</h2>

                    <div class="grid grid-cols-2 gap-2">
                    <div class="flex items-center gap-2">
                      <i class="fa-solid fa-table"></i>
                      <p>Breed: ${breed}</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="fa-regular fa-calendar"></i>
                      <p>Birth: ${date_of_birth}</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="fa-solid fa-dollar-sign"></i>
                      <p>Gender: ${gender}</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="fa-solid fa-mercury"></i>
                      <p>Price: ${price} $</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="fa-solid fa-dollar-sign"></i>
                      <p>Vaccination Status: ${vaccinated_status}</p>
                    </div>
                    </div>
                    <hr class="m-y-4">
                    <div>
                      <h1 class="text-lg font-semibold">Details Information</h1>
                      <p>${pet_details}</p>
                    </div>

                    <form method="dialog">
                      <button class="btn w-full bg-green-100 text-green-800">Cancel</button>
                    </form>
                  </div>
                </div>
    </div>
  `

  my_modal_1.showModal()
}

let currentCards = false
let currentCategory = 0
let toggleCategoty = false;
const categoryArea = document.getElementById("catagory");
fetchCategories();
const petArea = document.getElementById("card_holder");
fetchAllPets();

