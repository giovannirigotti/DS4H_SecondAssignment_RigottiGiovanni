

// -----------------
// JSON MANAGER
// -----------------

class MediaLibrary {
    constructor(data = {}) {
      this.mediaData = data.mediaLibrary || [];
    }
  
    addMediaEntry(type, name, platforms, actors, director, year, posterURL, notes = "") {
      const newMediaEntry = {
        type,
        name,
        platforms,
        actors,
        director,
        year,
        posterURL,
        notes,
      };
      this.mediaData.push(newMediaEntry);
    }
  
    deleteMediaEntry(nameToDelete) {
      this.mediaData = this.mediaData.filter(entry => entry.name !== nameToDelete);
    }
  
    getAllMedia() {
      return this.mediaData;
    }
  
    getMediaByName(name) {
      return this.mediaData.find(entry => entry.name === name);
    }
  
    updateNotes(name, newNotes) {
      const mediaEntry = this.getMediaByName(name);
      if (mediaEntry) {
        mediaEntry.notes = newNotes;
      }
    }
  
    searchMedia(type, name) {
      return this.mediaData.filter(entry => entry.type === type && entry.name.includes(name));
    }
  
    toJSON() {
      return { mediaLibrary: this.mediaData };
    }
}
  
// -----------------
// GENERAL SECTION
// -----------------

window.onload = init;

function init() {
    console.log("ready");
}

  // Example usage:
  
  const jsonDataUrl = './data/mediaLibrary.json';
  var jsonData;

  fetch(jsonDataUrl)
    .then(response => response.json())
    .then(data => {
        // Now 'data' contains the parsed JSON
        jsonData = data;
        console.log(jsonData);

        // You can use 'jsonData' here or pass it to a function
  })
  .catch(error => console.error('Error fetching JSON:', error));
  
  // Create an instance of the MediaLibrary class
  const mediaLibrary = new MediaLibrary(jsonData);
  
  // Add a new media entry
  mediaLibrary.addMediaEntry('Movie', 'New Movie', ['Netflix'], ['New Actor'], 'New Director', 2023, 'https://example.com/new-movie.jpg', 'Some notes about the new movie');
  
  // Delete a media entry
  mediaLibrary.deleteMediaEntry('The Shawshank Redemption');
  
  // Get all media entries
  const allMedia = mediaLibrary.getAllMedia();
  console.log(allMedia);
  
  // Get a specific media entry by name
  const specificMedia = mediaLibrary.getMediaByName('Inception');
  console.log(specificMedia);
  
  // Update notes for a media entry
  mediaLibrary.updateNotes('New Movie', 'Updated notes for the new movie');
  
  // Search for media entries by type and name
  const searchResults = mediaLibrary.searchMedia('Movie', 'New');
  console.log(searchResults);
  
  // Get the updated JSON data
  const updatedJsonData = mediaLibrary.toJSON();
  console.log(updatedJsonData);
  


// TODO: SortJson
// in json
// out orderd json/jsonString

// TODO: DrawTable
// in json - number of field to print
// out --> appendChild
