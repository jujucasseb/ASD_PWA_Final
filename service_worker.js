'use strict';

const CACHE_NAME = "magicdex_estatico";

const FILES_CACHE = [
    'css/animate.min.css',
    'css/bootstrap.min.css',
    'css/Carta_Solid.ttf',
    'css/Carta_Solid.woff',
    'css/styles.css',
    'imgs/arrow_left.png',
    'imgs/bg_detail.png',
    'imgs/load.gif',
    'imgs/logo_white.png',
    'imgs/logo.png',
    'imgs/offline_carta.png',
    'js/bootstrap.bundle.min.js',
    'off-line.html'
];

//Instalação e Ativação do PWA

self.addEventListener('install', (evt) =>{

    evt.waitUntil(

        caches.open(CACHE_NAME).then((cache) => {

            console.log("Service Worker: rregistrando caches estáticos");
            return cache.addAll(FILES_CACHE);

        })

    );

    self.skipWaiting();

});

self.addEventListener('activate', (evt) => {

    evt.waitUntil(
        
        caches.keys().then((keylist) => {

            return Promise.all(keylist.map((key) => {

                if(key !== CACHE_NAME){
                    return caches.delete(key);
                }

            }));

        })
    )
});

//Responder a Experiência Off-line

self.addEventListener('fetch', (evt)=>{

    if(evt.request.mode !== 'navigate'){
        return;
    }

    evt.respondWith(

        fetch(evt.request).catch(()=>{

            return caches.open(CACHE_NAME).then((cache) =>{

                return cache.match('off-line.html');

            });

        })

    );

});