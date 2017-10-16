<?php declare(strict_types=1);
namespace Manga;

class ApiDataRetriever {
    private const API_ENDPOINTS = [
        "GetChapter" => "https://doodle-manga-scraper.p.mashape.com/{siteid}/manga/{mangaid}/{chapterid}",
        "Search" => "https://doodle-manga-scraper.p.mashape.com/{siteid}/search",
        "GetAllManga" => "https://doodle-manga-scraper.p.mashape.com/{siteid}",
        "GetMangaDetails" => "https://doodle-manga-scraper.p.mashape.com/{siteid}/manga/{mangaid}/"
    ];

    private const SITE_ID = 'mangareader.net';

    private $apiKey;

    public function __construct(string $apiKey) {
        $this->apiKey = $apiKey;
    }

    public function search(string $query): ?array {
        $uri = self::API_ENDPOINTS["Search"];
        $uri = str_replace("{siteid}", self::SITE_ID, $uri);
        $queryParams = [
            "cover" => 1,
            "info" => 1,
            "I" => 20,
            "q" => $query
        ];

        return $this->getCommonResponse($uri, $queryParams);
    }

    public function getMangaDetails(string $mangaId): ?array {
        $uri = self::API_ENDPOINTS["GetMangaDetails"];
        $uri = str_replace("{siteid}", self::SITE_ID, $uri);
        $uri = str_replace("{mangaid}", $mangaId, $uri);

        return $this->getCommonResponse($uri);
    }

    public function getChapterPages(string $mangaId, int $chapterId): ?array {
        $uri = self::API_ENDPOINTS["GetChapter"];
        $uri = str_replace("{siteid}", self::SITE_ID, $uri);
        $uri = str_replace("{mangaid}", $mangaId, $uri);
        $uri = str_replace("{chapterid}", $chapterId, $uri);

        return $this->getCommonResponse($uri);
    }

    private function getCommonResponse(string $uri, array $queryParams = []): ?array {
        $context = stream_context_create([
            'http' => [
                'header' => "X-Mashape-Key: {$this->apiKey}\r\n" .
                    "Accept: text/plain"
            ]
        ]);
        $uri = $uri . '?' . http_build_query($queryParams);

        $data = file_get_contents($uri, false, $context);
        $data = json_decode($data, true);

        return $data;
    }
}