// Um desenvolvedor tentou criar um projeto que consome a base de dados de filme do TMDB para criar um organizador de filmes, mas desistiu 
// pois considerou o seu código inviável. Você consegue usar typescript para organizar esse código e a partir daí aprimorar o que foi feito?

// A ideia dessa atividade é criar um aplicativo que: 
//    - Busca filmes
//    - Apresenta uma lista com os resultados pesquisados
//    - Permite a criação de listas de filmes e a posterior adição de filmes nela

// Todas as requisições necessárias para as atividades acima já estão prontas, mas a implementação delas ficou pela metade (não vou dar tudo de graça).
// Atenção para o listener do botão login-button que devolve o sessionID do usuário
// É necessário fazer um cadastro no https://www.themoviedb.org/ e seguir a documentação do site para entender como gera uma API key https://developers.themoviedb.org/3/getting-started/introduction

let apiKey: string;
let requestToken: string;
let username: string;
let password: string;
let sessionId: number;
let userId: number;
let listasCriadas = new Map();
let selectedListId: number;


let loginButton = document.getElementById('login-button') as HTMLButtonElement;
let searchButton = document.getElementById('search-button') as HTMLButtonElement;
let createNewListButton = document.getElementById('create-list-button') as HTMLButtonElement;
let listSelector = document.getElementById('list-selector') as HTMLSelectElement;
let listFilmTable = document.querySelector('#list-container table') as HTMLTableElement;
let searchFilmTable = document.querySelector('#search-container table') as HTMLTableElement;



interface HttpClientGetArguments {
    url: string,
    method: string,
    body?: object | null | string
}

interface RequestTokenResponse {
    request_token: string,
}

interface SessionResponse {
    session_id: number,
}

interface AccountResponse {
    id: number
}

interface CreatedListsResponse{
    results: Array <ListResponse>
}

interface FilmSearchResponse{
    results: Array<FilmResponse>,
    total_pages: number,
    page: number
}

interface FilmResponse{
    id: number,
    original_title:string,
}

interface ListResponse{
    items: Array<FilmResponse>,
    description: string,
    name: string,
    id: number
}


listSelector.addEventListener('change', async function() {
    let listName = this.value;
    selectedListId = listasCriadas.get(listName);
    await updateSelectedFilmInformation();
});


loginButton.addEventListener('click', async () => {
    await criarRequestToken();
    await logar();
    await criarSessao();
    await pegarInformacoesDaConta();
    await preencherListasCriadas();
    updateListSelector();
})

searchButton.addEventListener('click', async () => {
    let query = (document.getElementById('search-text') as HTMLInputElement).value;
    let searchResponse: FilmSearchResponse = await procurarFilme(query, 1);

    await updateFilmSearchResults(searchResponse);

    let pagesNavigationWrapper = document.querySelector("#search-container .list-page-navigation") as HTMLDivElement;
    updatePagesNavigationContainer(pagesNavigationWrapper, searchResponse.total_pages, async (page:number) =>{
        let searchResponse: FilmSearchResponse = await procurarFilme(query, page);
        await updateFilmSearchResults(searchResponse);
    })
    
})

createNewListButton.addEventListener('click', async ()=> {
    let newListName = (document.getElementById('new-list-name') as HTMLInputElement).value;
    let newListDescription = (document.getElementById('new-list-description') as HTMLTextAreaElement).value;

    await criarLista(newListName, newListDescription);
    await preencherListasCriadas();
    updateListSelector();
})

function preencherSenha() {
    password = (document.getElementById('senha') as HTMLInputElement).value;
    validateLoginButton();
}

function preencherLogin() {
    username = (document.getElementById('username') as HTMLInputElement).value;
    validateLoginButton();
}

function preencherApi() {
    apiKey = (document.getElementById('api-key') as HTMLInputElement).value;
    validateLoginButton();
}

function validateLoginButton() {
    if (password && username && apiKey) {
        loginButton.disabled = false;
    } else {
        loginButton.disabled = true;
    }
}

async function preencherListasCriadas(){
    let createdLists: CreatedListsResponse = await pegarListasCriadas();
    listasCriadas.clear();
    createdLists.results.forEach((item: ListResponse) => {
        listasCriadas.set(item.name, item.id);
    })
}

async function updateSelectedFilmInformation(){
    let informationOfSelectedList :ListResponse = await pegarLista(selectedListId);

    // Atualiza a tabela de filmes da lista
    let filmList: Array<FilmResponse> = informationOfSelectedList.items;
    updateFilmTable(listFilmTable, filmList, "-", async (filmInfo: FilmResponse) => {
        await removerFilmeDaLista(filmInfo.id, selectedListId);
        updateSelectedFilmInformation();
    });

    //Atualiza a descrição da lista
    let selectecListDescription = document.getElementById('selected-list-description') as HTMLSpanElement;
    selectecListDescription.innerHTML = informationOfSelectedList.description;
}

async function updateFilmSearchResults(searchResponse: FilmSearchResponse){
    let filmList: Array<FilmResponse> = searchResponse.results;
    updateFilmTable(searchFilmTable, filmList, "+", async (filmInfo: FilmResponse) => {
        await adicionarFilmeNaLista(filmInfo.id, selectedListId);
        await updateSelectedFilmInformation();
    });
}

function updateListSelector() {
    listSelector.innerHTML = '';
    for (const listName of listasCriadas.keys()) {
        let selectorOption = document.createElement('option') as HTMLOptionElement;
        selectorOption.value = listName;
        selectorOption.innerHTML = listName;
        listSelector.appendChild(selectorOption);
    }
    listSelector.dispatchEvent(new Event('change'));
}

function updateFilmTable(listView: HTMLTableElement, listOfFilms: Array<FilmResponse>, buttonLabel: string, buttonCallback: (filmInfo: FilmResponse)=>void) {
    listView.innerHTML = '';

    for (const filmInfo of listOfFilms) {
        let row = document.createElement('tr') as HTMLTableRowElement;
        let cellLabel = document.createElement('td') as HTMLTableCellElement;
        let cellButton = document.createElement('td') as HTMLTableCellElement;
        let button = document.createElement('button') as HTMLButtonElement;

        cellLabel.innerHTML = filmInfo.original_title;
        cellButton.appendChild(button);
        button.addEventListener('click', ()=>{
            buttonCallback(filmInfo);
        });
        button.innerHTML = buttonLabel;

        row.appendChild(cellLabel);
        row.appendChild(cellButton);
        listView.appendChild(row);
    }
}

function updatePagesNavigationContainer(container: HTMLDivElement, numberOfPages:number, buttonCallback: (pageNumber:number)=>void){
    container.innerHTML = "";
    let pageIncreaseButton = document.createElement('button') as HTMLButtonElement;
    let pageDecreaseButton = document.createElement('button') as HTMLButtonElement;
    let pageNumber = document.createElement('span') as HTMLSpanElement;

    pageIncreaseButton.innerHTML = ">";
    pageDecreaseButton.innerHTML = "<";
    pageNumber.innerHTML = `1/${numberOfPages}`;

    container.appendChild(pageDecreaseButton);
    container.appendChild(pageNumber);
    container.appendChild(pageIncreaseButton);

    var actualPage = 1;
    pageIncreaseButton.addEventListener('click', ()=>{
        if (actualPage<numberOfPages){
            actualPage++;
            pageNumber.innerHTML = `${actualPage}/${numberOfPages}`;
            buttonCallback(actualPage);
        }
    });
    pageDecreaseButton.addEventListener('click', ()=>{
        if (actualPage>1){
            actualPage--;
            pageNumber.innerHTML = `${actualPage}/${numberOfPages}`;
            buttonCallback(actualPage);
        }
    });
}


type HttpClientResponse = RequestTokenResponse & 
SessionResponse & CreatedListsResponse & AccountResponse & ListResponse & FilmSearchResponse & FilmResponse;

class HttpClient {
    static async get({ url, method, body = null }: HttpClientGetArguments): Promise<HttpClientResponse> {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open(method, url, true);

            request.onload = () => {
                if (request.status >= 200 && request.status < 300) {
                    resolve(JSON.parse(request.responseText));
                } else {
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    })
                }
            }
            request.onerror = () => {
                reject({
                    status: request.status,
                    statusText: request.statusText
                })
            }

            if (body) {
                request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                body = JSON.stringify(body);
            }
            request.send(body);
        })
    }
}

async function procurarFilme(query: string, page:number = 1): Promise<FilmSearchResponse>{
    query = encodeURI(query)
    let result: FilmSearchResponse = await HttpClient.get({
        url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=${page}`,
        method: "GET"
    })
    console.log("Film Search: ",result);
    return result
}

async function pegarInformacoesFilme(filmeId: number): Promise<FilmResponse>{
    let result: FilmResponse = await HttpClient.get({
        url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=en-US`,
        method: "GET"
    })
    console.log("Film information: ", result);
    return result
}

async function criarRequestToken(): Promise<void> {
    let result: RequestTokenResponse = await HttpClient.get({
        url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
        method: "GET"
    })
    console.log("Token: ", result);
    requestToken = result.request_token
}

async function logar(): Promise<void> {
    await HttpClient.get({
        url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
        method: "POST",
        body: {
            username: `${username}`,
            password: `${password}`,
            request_token: `${requestToken}`
        }
    })
}

async function criarSessao(): Promise<void> {
    let result: SessionResponse = await HttpClient.get({
        url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
        method: "GET"
    })
    console.log("Create session: ", result);
    sessionId = result.session_id;
}

async function criarLista(nomeDaLista: string, descricao: string): Promise<void> {
    let result = await HttpClient.get({
        url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
        method: "POST",
        body: {
            name: nomeDaLista,
            description: descricao,
            language: "pt-br"
        }
    })
    console.log("Create list: ", result);
}

async function adicionarFilmeNaLista(filmeId: number, listaId: number): Promise<void> {
    let result = await HttpClient.get({
        url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
        method: "POST",
        body: {
            media_id: filmeId
        }
    })
    console.log("Add film to list: ", result);
}

async function removerFilmeDaLista(filmeId: number, listaId: number): Promise<void> {
    let result = await HttpClient.get({
        url: `https://api.themoviedb.org/3/list/${listaId}/remove_item?api_key=${apiKey}&session_id=${sessionId}`,
        method: "POST",
        body: {
            media_id: filmeId
        }
    })
    console.log("Remove film from list:", result);
}


async function pegarLista(listId:number): Promise<ListResponse> {
    let result: ListResponse = await HttpClient.get({
        url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
        method: "GET"
    })
    console.log("Take list: ", result);
    return result;
}

async function pegarInformacoesDaConta(): Promise<void> {
    let result: AccountResponse = await HttpClient.get({
        url: `https://api.themoviedb.org/3/account?api_key=${apiKey}&session_id=${sessionId}`,
        method: "GET"
    })
    console.log("Account information: ", result);
    userId = result.id;
}

async function pegarListasCriadas(): Promise<CreatedListsResponse> {
    let result: CreatedListsResponse = await HttpClient.get({
        url: `https://api.themoviedb.org/3/account/${userId}/lists?api_key=${apiKey}&session_id=${sessionId}`,
        method: "GET"
    })
    console.log("Created lists: ", result);
    return result
}
