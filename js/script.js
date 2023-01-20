

/*
SETTIMEOUT METHOD EXECUTES CODE AFTER SPECIFIED TIME 
SO THAT OUR REMOVE AND SHOW PART WORK AFTER 2000 ms WAIT TIME 
Preloader yapısının çalışması için gerekli method
Öncelikle preloader harici html element leri displayNone css class i eklenerek görünmeleri engellenir
Bu sayede sadece preloader gözükür
setTimeOut -> Bu function 2000 ms geçtikten sonra içeriği çalıştırır 
ve içerisinde preloader i silen , html elementler ine eklediğimiz displayNone css class larını kaldıran
yapıyı cağırır
*/
function preloaderMethod(){
    var contents = document.querySelectorAll(".elements"); // all html contents selected by querySelector
    
    makeContentOpposite(contents); //HTML element leri display none
    setTimeout(()=>{
        makeContentOpposite(contents)
        document.querySelector(".loading-window").remove();
    },2000); // 2s sonra içerik çalışır
}

/*
Content leri alır , forEach ve arrow function kullanarak display none varsa kaldırır yoksa ekler
*/
function makeContentOpposite(contents){
    contents.forEach(element => {

        if(element.classList.contains("makeDisplayNone")) element.classList.remove("makeDisplayNone");
        else  element.classList.add("makeDisplayNone");

    });
}


/*
JS içerisinde html part larının konumlarına erişmek için bu şekilde bir değişken içerisinde sakladık
*/
var htmlParts ={ 
    "mainPart":"htmlFiles/mainPart.html",
    "subPart":"htmlFiles/subPart.html",
    "contactPart":"htmlFiles/contactPart.html",
    "lowerPart":"htmlFiles/lowerPart.html"
}

/* BASLANGICTA MAIN KISMI YUKLEMEYI SAGLIYOR */
function addInPartInitially(){
    changeMainPart(htmlParts.mainPart); //mainPart i ilgili konumdaki html elemanı yerleştirmeyi sağlayan metoda yolluyor
}


/*
Ajax kullanarak içerisinde gelen path i request ediyor ve ilgili response ta html i almış oluyor
Aldığı response u da main içerisinde ilgili yere innerHTML ile yerleştiriyor ve gerekli eventlistener ları eklemeyi sağlayan metodu çağırıyor
3. parametre olan false sayesinde html tarzı yapıları da request edebiliyoruz. true yaptığımız zaman json harici yapıları request edemiyoruz
*/
function changeMainPart(htmlPath){
    $ajaxUtils
    .sendGetRequest(htmlPath,
        function(response){
            document.getElementById("mainTagLoad").innerHTML = response;
            modelButtonClicked(); // to add event listeners
        },false
    );
    
}

/*
Main kısmında belirli bir yer değiştiğinde ve yeni yüklenen html kısmında belirli buttonlar olduğu için
bazı listener ları metod kullanarak eklememiz gerekti.
carButtons class ına sahip html element leri alır ve click işlemi gerçekleştiğinde subPart lardan ilgili
yapının yüklenmesini sağlayan function u çağırır
*/
function modelButtonClicked(){
    document.querySelectorAll(".carButtons")
    .forEach(clickedButton=>{
            clickedButton.addEventListener("click",()=>{
            var loadPageId = clickedButton.id;

            subPartLoader(loadPageId);
        });
    })
}


/*
Main altındaki 4 alt kategoriden 1 ine geçilmek istendiğinde bu metod çağırılır ve mainPart ın içeriği değiştirilir
ve tıklanan button a göre yeni content eklenir
*/

function subPartLoader(loadPageId){
    changeMainPart(htmlParts.subPart); // change main content
                
    window.scrollTo(0,0); //sayfayı yukarı kaydırmak için
    changeContent(loadPageId); // change new contents values

}

/*
Alt kategorilerden biri açıldıktan sonra onların da alt kategorilerine geçmek istediğimiz zaman
alt kategorideki buttonlara listener atamamız gerekir ve tıklandıklarında marka kategorisine geçişi sağlar
 */

function subPartButtonClicked(currentModel){
    document.querySelectorAll(".modelButtons")
    .forEach(clickedButtonInSubPart =>{
        clickedButtonInSubPart.addEventListener("click",()=>{
            var loadLowerModelId = clickedButtonInSubPart.id;
            
            lowerPartLoader(currentModel,loadLowerModelId); // marka kategorisi yani alt kategorinin alt kategorisini yükleyen yapı
        })
    })
}

/*
Marka kategorisine geçmek için ilgili buttonlara tıklandığında bu metod çağırılır ve html deki değişecek kısım bu metod sayesinde
yüklenir ve content i json dan alınarak güncellenir
*/
function lowerPartLoader(lowerPartId,loadLowerModelId){
    changeMainPart(htmlParts.lowerPart); // change content

    window.scrollTo(0,0); //sayfayı yukarı kaydırmak için

    changeLowerPartContent(lowerPartId,loadLowerModelId); //change new contents values
}

/*
Marka kategorisindeki elemanların content lerini değiştirmek için kullandığımız metod
json dosyasına request atılır ve response kullanılarak ilgili elemanlar değiştirilir.
3. parametrenin true olması sayesinde json process edilir
içerisinde ek olarak fotoğrafların 1s aralıklarla geçişini sağlayan bir yapı bulunmaktadır
*/
function changeLowerPartContent(lowerPartId,loadLowerModelId){
    $ajaxUtils.sendGetRequest("/jsonFiles/modelInformations.json", 
    function(response){ // request
            count = 0; // to select first image from json response
            
            var imagesFromJson = response[lowerPartId][loadLowerModelId]["images"]; //json dan gelen image path lerini sakladık
            document.getElementById("img-car-model").src = imagesFromJson[count]+".jpg";  // ilk başta first image in yerleştirilmesi
            document.getElementById("orderLink").href = response[lowerPartId][loadLowerModelId]["link"]; //order buttonuna response taki link in eklenmesi

            
            var ratingArray = response[lowerPartId][loadLowerModelId]["ratingScore"]; // rating score ları alınır ve saklanır
            document.getElementById("pbCritics").style.width = `${ratingArray[0]*10}%` // ilgili rating parametreleri hesaplanarak genişlik ve yazı değerleri değiştirilir
            document.getElementById("pbCritics").innerText = ratingArray[0];

            document.getElementById("pbPerformance").style.width = `${ratingArray[1]*10}%`
            document.getElementById("pbPerformance").innerText = ratingArray[1];

            document.getElementById("pbInterior").style.width = `${ratingArray[2]*10}%`
            document.getElementById("pbInterior").innerText = ratingArray[2];

            document.getElementById("pbSafety").style.width = `${ratingArray[3]*10}%`
            document.getElementById("pbSafety").innerText = ratingArray[3];

            document.getElementById("pbQuality").style.width = `${ratingArray[4]*10}%`
            document.getElementById("pbQuality").innerText = ratingArray[4];


            document.getElementById("carModelName").innerText = response[lowerPartId][loadLowerModelId] // markanın adını ilgili html element e aktarılması

            switch (loadLowerModelId) { // markanın adını ilgili html element e aktarılması
                case "firstModelButton":
                    document.getElementById("carModelName").innerText = response[lowerPartId]["firstModel"]
                    break;
                case "secondModelButton":
                    document.getElementById("carModelName").innerText = response[lowerPartId]["secondModel"]

                    break;
                case "thirdModelButton":
                    document.getElementById("carModelName").innerText = response[lowerPartId]["thirdModel"]

                    break;
                case "fourthModelButton":
                    document.getElementById("carModelName").innerText = response[lowerPartId]["fourthModel"]

                    break;
            
            }

            // sol taraftaki image lara mouse girdiğinde bu metod çalışır ve 1s aralıklarla count değeri değişir ve resimler sırayla değiştirilmiş olur
            //mouse çıktığında ise setInterval metodu clear yapılır
            document.getElementById("model-image-card").addEventListener("mouseenter",()=>{ 
                 var i = setInterval(()=>{
                     document.getElementById("img-car-model").src = imagesFromJson[count]+".jpg";
                     count++;
                     if(count >= 3){
                         count = 0;
                     }
                 },1000);

                 document.getElementById("model-image-card").addEventListener("mouseleave",()=>{
                    clearInterval(i);
                })
             })
        },true);

}

/*
SubPart a geçildiğinde content in değiştirilmesini sağlayan yapı
json a request atılır ve response a göre ilgili element ler response içeriğiyle değiştirilir
*/
function changeContent(loadPageId){
    
    $ajaxUtils.sendGetRequest("/jsonFiles/modelInformations.json",
    function(response){
            document.querySelector("main").style.backgroundImage = `url(${response[loadPageId].backgroundImageAddress}.jpg)`;
    
            document.getElementById("titlePart").innerText = response[loadPageId].model;
            document.getElementById("textPart").innerText = response[loadPageId].text;

            document.getElementById("firstModelButton").innerText = response[loadPageId].firstModel;
            document.getElementById("secondModelButton").innerText = response[loadPageId].secondModel;
            document.getElementById("thirdModelButton").innerText = response[loadPageId].thirdModel;
            document.getElementById("fourthModelButton").innerText = response[loadPageId].fourthModel;
    
            subPartButtonClicked(loadPageId); // subpartta button a tıklandığında yapılacak değişikleri ayarlayan method

        },true);

}

/*
Header buttonlarına tıklandığında tıklanan button a göre ilgili subpart ın yüklenmesi sağlanır
*/
function headerFooterButtonClicked(){
    document.querySelectorAll(".headerFooterButtons")
    .forEach(clickedButton =>{
        clickedButton.addEventListener("click",()=>{
            var loadPageId = clickedButton.id;
            
            switch (loadPageId) {
                case  "headerHome":
                    mainReloader();

                    break;
            
                case "headerSuv" :
                    subPartLoader("suvButton");
                    break;

                case "headerPickUp" :
                    subPartLoader("pickUpButton");
                    break;

                case "headerSport" :
                    subPartLoader("sportButton");
                    break;

                case "headerMuscle" :
                    subPartLoader("muscleButton");
                    break;

                case "headerContact" :
                    contactLoader();
                    break;

            }

        })
    })
}



/*Logo ya tıklandığında mainPage e geçilmeyi sağlar ve maindeki button işlevlerini ekleyen metodu çağırır*/
function logoButtonClicked(){
    document.getElementById("logoButton").addEventListener("click",()=>{
 
    mainReloader();


    })
}

/*
Main sayfaya geçildiğinde html in ve background image ın yuklenmesini sağlayan yapı
sonrasında model buttonlarının işlevlerini ekleyen function u cağırır
 */
function mainReloader(){
    $ajaxUtils
    .sendGetRequest(htmlParts.mainPart,
    function(response){
        document.getElementById("mainTagLoad").innerHTML = response;
        document.getElementById("mainTagLoad").style.backgroundImage = "url(images/mainWp.jpg)";
        
        modelButtonClicked();

    },false
    );
}

/*
Contact button una tıklandığında ilgili kısmın yüklenmesini sağlayan yapı
sonrasında model buttonlarının işlevlerini ekleyen function u cağırır
*/
function contactLoader(){
    $ajaxUtils
    .sendGetRequest(htmlParts.contactPart,
    function(response){
        document.getElementById("mainTagLoad").innerHTML = response;
        document.getElementById("mainTagLoad").style.backgroundImage = "url(images/mainWp.jpg)";
        
        
        modelButtonClicked();

    },false
    );
}



/*Proje içeriği yüklendikten sonra js yapılarının dahil edilmesi için gerekli yapı -> DOMContentLoaded ile sağlanır ve document e eventlistener eklenerek yapılır */
document.addEventListener("DOMContentLoaded",()=>{

    
    preloaderMethod(); /* Preloader kısmı için gerekli method*/
    
    addInPartInitially(); /*Başlangıçta main part ın yüklenmesi için gerekli method */

    headerFooterButtonClicked(); /*header ve footer daki buttonların event lerinin eklenmesi için gerekli method */

    logoButtonClicked(); /* logoya tıklandığında ilk baştaki sayfanın yüklenmesi için gerekli method*/
    
    modelButtonClicked(); /*Subpart sayfasında model seçimi yapıldığında ilgili model in mainPart a yüklenmesi için gerekli method */
})