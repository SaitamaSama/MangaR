<?php declare(strict_types=1);

include_once __DIR__ . '/vendor/autoload.php';

$api = new \Manga\ApiDataRetriever('NUWwLIaRQHmshr8yCoXFUvE5kVUOp1pxwRdjsnTUNPHFzbNYIg');

$router = Aerys\router()
    ->route('GET', '/search/{animeid}', function (\Aerys\Request $request, \Aerys\Response $response, array $args) use ($api) {
        $results = $api->search(rawurldecode($args['animeid']));
        $response
            ->addHeader('Content-Type', 'application/json')
            ->end(json_encode($results, JSON_PRETTY_PRINT));
        return;
    })
    ->route('GET', '/manga/{mangaid}', function (\Aerys\Request $request, \Aerys\Response $response, array $args) {
        $response
            ->end(file_get_contents(__DIR__ . '/src/Pages/Manga.html'));
    })
    ->route('GET', '/api/manga/details/{mangaid}', function (\Aerys\Request $request, \Aerys\Response $response, array $args) use ($api) {
        $results = $api->getMangaDetails($args["mangaid"]);
        $response
            ->addHeader('Content-Type', 'application/json')
            ->end(json_encode($results, JSON_PRETTY_PRINT));
    })
    ->route('GET', '/read/manga/{mangaId}/c/{chapterId}', function (\Aerys\Request $request, \Aerys\Response $response, array $args) {
        $response
            ->end(str_replace('{ChapterId}', $args["chapterId"], str_replace("{MangaId}", $args['mangaId'], file_get_contents(__DIR__ . '/src/Pages/Read.html'))));
    })
    ->route('GET', '/api/get-chapter/{mangaId}/{chapterId}', function (\Aerys\Request $request, \Aerys\Response $response, array $args) use ($api) {
        $results = $api->getChapterPages($args['mangaId'], (int) $args['chapterId']);
        $response
            ->addHeader('Content-Type', 'application/json')
            ->end(json_encode($results, JSON_PRETTY_PRINT));
    });

return (new \Aerys\Host())
    ->expose('*', 80)
    ->use($router)
    ->use(\Aerys\root(__DIR__ . '/public'));