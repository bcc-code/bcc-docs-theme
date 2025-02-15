const doubleFunction = () => {
    const showSearchResults = document.getElementById("search");

    if (showSearchResults.classList.contains("active")) {
        document.getElementById("search_results").innerHTML = "";
    } else {
        showSearchResults.classList.add("active");
    }

    searchInFiles();
}

function closeModal() {
    const showSearchResults = document.getElementById("search");
    showSearchResults.classList.remove("active");

}

async function searchInFiles() {

    const searchInput = document.getElementById("search_input");
    const searchInputValue = searchInput.value;

    const searchUrl = `https://api.github.com/search/code?q=${searchInputValue}+in:file+language:markdown+org:bcc-code&per_page=50`;

    const getMarkdownData = await fetch(searchUrl).then(response => response.json()).catch(error => console.log(error));
    console.log(getMarkdownData);
    let data;
    for (data of getMarkdownData.items) {

        const markdownRepositoryData = data.repository;
        const markdownRepositoryName = markdownRepositoryData.name;
        const markdownFilePath = data.path;
        const markdownHtmlUrl = data.html_url;
        const markdownRepo = data.repository;
        const markdownRepoName = data.repository.name;
        const markdownRepoUrl = markdownRepo.html_url;

        let sliceFilePath = markdownFilePath.slice(0, -3);
        sliceFilePath = sliceFilePath.replace("/index", "");

        let markdownPageUrl = String(sliceFilePath);
        const searchProjects = "_projects"
        const searchDocs = "_docs"
        const searchGuides = "_guides"
        const searchTopics = "_topics"
        const searchPlugins = "_plugins"


        if (markdownPageUrl.includes(searchProjects)) {
            markdownPageUrl = String(markdownPageUrl).replace(/^_projects/, "/projects");
        } else if (markdownPageUrl.includes(searchDocs)) {
            markdownPageUrl = String(markdownPageUrl).replace(/^_docs/, "/docs");
        } else if (markdownPageUrl.includes(searchGuides)) {
            markdownPageUrl = String(markdownPageUrl).replace(/^_guides/, "/guides");
        } else if (markdownPageUrl.includes(searchTopics)) {
            markdownPageUrl = String(markdownPageUrl).replace(/^_topics/, "/topics");
        } else if (markdownPageUrl.includes(searchPlugins)) {
            markdownPageUrl = String(markdownPageUrl).replace(/^_plugins/, "/plugins");
        } else if (markdownPageUrl.indexOf("docs") !== -1) {
            markdownPageUrl = String(sliceFilePath).replace(/^docs/, markdownRepositoryName);
        } else {
            markdownPageUrl = markdownHtmlUrl;
        }


        const createLocation = document.getElementById("search_results")
        let createListItem = document.createElement("li");
        let searchSuggestion = document.createElement("a");
        let repoSpan = document.createElement("a")

        createListItem.className = "search_suggestion";

        searchSuggestion.setAttribute("href", `${markdownPageUrl}`);
        searchSuggestion.innerText = `${sliceFilePath}`;

        repoSpan.className = "result_repository"
        repoSpan.setAttribute("href", `${markdownRepoUrl}`);
        repoSpan.setAttribute("target", '_blank');
        repoSpan.innerText = `${markdownRepositoryName}`;

        createLocation.appendChild(createListItem).appendChild(searchSuggestion);
        createLocation.appendChild(createListItem).appendChild(repoSpan);


    }

}