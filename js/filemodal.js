function toggleModal(modalID) {
  const modal = document.getElementById(modalID);
  if (modal.classList.contains("show")) {
    modal.classList.remove("show");
  } else {
    // close all other modals
    const modals = document.querySelectorAll(".modal-container");
    modals.forEach((m) => {
      m.classList.remove("show");
    });
    modal.classList.add("show");
  }
}

const modalButtons = document.querySelectorAll("[data-toggles-modal]");
modalButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    toggleModal(e.target.getAttribute("data-toggles-modal"));
  });
});

// clicking outside of a modal closes it (on the modal-container)
const modalContainers = document.querySelectorAll(".modal-container");
modalContainers.forEach((modalContainer) => {
  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContainer) {
      toggleModal(modalContainer.id);
    }
  });
});

const fetchGitFiles = async () => {
  const response = await fetch("https://api.github.com/repos/bio-sims/kirby-bauer/contents/files");
  if (!response.ok) {
    const errorMessage = document.createElement("p");
    errorMessage.classList.add("error");
    errorMessage.textContent = "An error occurred while fetching files";
    document.getElementById("files-modal-list").appendChild(errorMessage);
    return;
  }
  const data = await response.json();
  const files = data.filter((file) => file.type === "file");
  const fileListing = document.getElementById("files-modal-list");

  if (files.length === 0) {
    const noDataMessage = document.createElement("li");
    noDataMessage.classList.add("error");
    noDataMessage.textContent = "No files found!";
    fileListing.appendChild(noDataMessage);
  } else {
    fileListing.insertBefore(document.createElement("p"), fileListing.firstChild).textContent = "Available supplemental materials";
    files.forEach((file) => {
      const fileElement = document.createElement("li");
      const fileLink = document.createElement("a");
      // open file in new tab
      fileLink.target = "_blank";
      fileLink.href = file.download_url;
      fileLink.textContent = file.name;
      fileElement.appendChild(fileLink);
      fileListing.appendChild(fileElement);
    });
  }
};

fetchGitFiles();
