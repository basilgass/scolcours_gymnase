<?php

namespace App\Support;

use App\Models\Chapter;
use App\Models\Course;
use App\Models\Deck;
use App\Models\Theme;

class NotFoundSuggestionResolver
{
	public function resolve(string $path): ?array
	{
		$segments = array_values(array_filter(explode('/', $path)));
		$first = $segments[0] ?? null;

		return match ($first) {
			'tools' => [
				'label' => 'Voir tous les outils',
				'url'   => route('tools.index'),
			],
			'cours' => $this->resolveCourse($segments),
			'decks' => $this->resolveDeck($segments),
			default => $this->resolveThemeChapter($segments),
		};
	}

	/**
	 * @param string[] $segments
	 * @return array{label: string, url: string, theme_id: int|null}
	 */
	private function resolveCourse(array $segments): array
	{
		$themeId = null;

		$slug = $segments[1] ?? null;
		if ($slug) {
			$themeId = Course::where('slug', $slug)->value('theme_id');
		}

		return [
			'label'    => 'Voir tous les cours',
			'url'      => route('courses.index'),
			'theme_id' => $themeId,
		];
	}

	/**
	 * @param string[] $segments
	 * @return array{label: string, url: string, theme_id: int|null}
	 */
	private function resolveDeck(array $segments): array
	{
		$slug = $segments[1] ?? null;
		if ($slug) {
			$deck = Deck::where('slug', $slug)->with('chapter.theme')->first();

			if ($deck?->chapter) {
				return [
					'label'    => "Aller au chapitre « {$deck->chapter->title} »",
					'url'      => route('themes.chapters.show', [$deck->chapter->theme->slug, $deck->chapter->slug]),
					'theme_id' => $deck->chapter->theme->id,
				];
			}
		}

		return [
			'label'    => 'Voir tous les decks',
			'url'      => route('decks.index'),
			'theme_id' => null,
		];
	}

	/**
	 * @param string[] $segments
	 * @return array{label: string, url: string, theme_id: int|null}|null
	 */
	private function resolveThemeChapter(array $segments): ?array
	{
		$themeSlug = $segments[0] ?? null;
		if (!$themeSlug) {
			return null;
		}

		$theme = Theme::getThemesFromCache()->firstWhere('slug', $themeSlug);
		if (!$theme) {
			return null;
		}

		$chapterSlug = $segments[1] ?? null;
		if (!$chapterSlug) {
			return null;
		}

		$chapter = Chapter::where('slug', $chapterSlug)->first();

		if (!$chapter) {
			return [
				'label'    => "Retourner au thème « {$theme->title} »",
				'url'      => route('themes.show', $theme->slug),
				'theme_id' => $theme->id,
			];
		}

		return [
			'label'    => "Aller au chapitre « {$chapter->title} »",
			'url'      => route('themes.chapters.show', [$theme->slug, $chapter->slug]),
			'theme_id' => $theme->id,
		];
	}
}
