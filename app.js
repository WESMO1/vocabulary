async function getResponse() {
  const input = document.getElementById('myInput');
  const listItems = document.querySelectorAll('.li');
  const audioButton = document.querySelector('.svg-audio');

  const handleAudioButtonClick = async (data) => {
    const audioUrl = data[0].phonetics.slice(0, 10).find((item) => item.audio)?.audio;

    if (audioUrl) {
      const audio = new Audio(audioUrl);
      await audio.play();
    }
  };

  const showData = (word, phonetics, definition1, definition3, partOfSpeech, synonyms) => {
    listItems[0].innerHTML = word;
    listItems[1].innerHTML = phonetics;
    listItems[2].innerHTML = definition1;
    listItems[3].innerHTML = definition3;
    listItems[4].innerHTML = partOfSpeech;
    listItems[5].innerHTML = synonyms.slice(0, 3).join(', ');
  }

  let loaded = false;
  let lastSearchTerm = '';

  const showListItems = () => {
    listItems.forEach(li => li.style.display = "none"); 
  };
  
  showListItems(); 
  

  const fetchData = async (searchTerm) => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      alert('Error fetching data from API.');
    }
  }

  let data;

  const updateResults = async (searchTerm) => {
    if (searchTerm.length > 0) {
      data = await fetchData(searchTerm);
      const word = data[0].word;
      const phonetics = data[0].phonetics[0].text;
      const definition1 = data[0].meanings[0].definitions[0].definition;
      const definition3 = data[0].meanings[0].definitions[2].definition;
      const partOfSpeech = data[0].meanings[0].partOfSpeech;
      const synonyms = data[0].meanings[0].synonyms;
  
      listItems[0].innerHTML = word;
      listItems[1].innerHTML = phonetics;
      listItems[2].innerHTML = definition1;
      listItems[3].innerHTML = definition3;
      listItems[4].innerHTML = partOfSpeech;
      listItems[5].innerHTML = synonyms.slice(0, 3).join(', ');
  
      loaded = true;
      lastSearchTerm = searchTerm;
      input.value = ''; 
  
      listItems.forEach(li => li.style.display = "flex"); 
    } else {
      listItems.forEach(li => li.style.display = "none"); 
    }
  };
  
  
  

  input.addEventListener('input', async function(event) {
    const searchTerm = event.target.value;
    console.log(searchTerm);
  
    setTimeout(async () => {
      await updateResults(searchTerm);
    }, 5000);
  });
  

  audioButton.addEventListener('click', async () => {
    if (lastSearchTerm.length > 0) {
      const audioData = await fetchData(lastSearchTerm);
      handleAudioButtonClick(audioData);
    }
  });

  showListItems();
}

getResponse();




  
  



