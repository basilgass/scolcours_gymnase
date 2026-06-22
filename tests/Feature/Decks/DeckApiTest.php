<?php

namespace Tests\Feature\Decks;

use App\Models\Chapter;
use App\Models\Deck;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeckApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_is_public_and_returns_decks_with_card_count(): void
    {
        Deck::factory()->withCards(2)->create();
        Deck::factory()->create();

        $this->getJson(route('api.decks.index'))
            ->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonPath('0.cards_count', 2)
            ->assertJsonPath('1.cards_count', 0);
    }

    public function test_show_is_public_and_exposes_the_deck_shape(): void
    {
        $deck = Deck::factory()->create(['title' => 'Mon paquet', 'slug' => 'mon-paquet']);

        $this->getJson(route('api.decks.show', $deck))
            ->assertStatus(200)
            ->assertJsonPath('id', $deck->id)
            ->assertJsonPath('title', 'Mon paquet')
            ->assertJsonPath('slug', 'mon-paquet')
            ->assertJsonPath('active', true);
    }

    public function test_admin_can_store_a_deck(): void
    {
        $this->actingAsAdmin();

        $this->postJson(route('api.admin.decks.store'), [
            'title' => 'Nouveau deck',
            'slug'  => 'nouveau-deck',
        ])->assertStatus(201)
            ->assertJsonPath('title', 'Nouveau deck')
            ->assertJsonPath('slug', 'nouveau-deck');

        $this->assertDatabaseHas('decks', ['slug' => 'nouveau-deck']);
    }

    public function test_store_validates_title_and_slug_length(): void
    {
        $this->actingAsAdmin();

        $this->postJson(route('api.admin.decks.store'), [
            'title' => 'ab',
            'slug'  => 'ab',
        ])->assertStatus(422)->assertJsonValidationErrors(['title', 'slug']);
    }

    public function test_store_rejects_an_unknown_chapter(): void
    {
        $this->actingAsAdmin();

        $this->postJson(route('api.admin.decks.store'), [
            'title'      => 'Deck valide',
            'slug'       => 'deck-valide',
            'chapter_id' => 99999,
        ])->assertStatus(422)->assertJsonValidationErrors(['chapter_id']);
    }

    public function test_admin_can_update_a_deck(): void
    {
        $this->actingAsAdmin();
        $deck = Deck::factory()->create(['title' => 'Avant']);
        $chapter = Chapter::factory()->create();

        $this->patchJson(route('api.admin.decks.update', $deck), [
            'title'      => 'Après',
            'slug'       => $deck->slug,
            'chapter_id' => $chapter->id,
        ])->assertStatus(200)
            ->assertJsonPath('title', 'Après');

        $this->assertSame('Après', $deck->fresh()->title);
    }

    public function test_admin_can_delete_a_deck(): void
    {
        $this->actingAsAdmin();
        $deck = Deck::factory()->create();

        $this->deleteJson(route('api.admin.decks.destroy', $deck))
            ->assertStatus(204);

        $this->assertModelMissing($deck);
    }

    public function test_store_requires_admin(): void
    {
        $payload = ['title' => 'Deck X', 'slug' => 'deck-x'];

        $this->postJson(route('api.admin.decks.store'), $payload)->assertStatus(401);

        $this->actingAsUser();
        $this->postJson(route('api.admin.decks.store'), $payload)->assertForbidden();
    }

    public function test_update_and_destroy_require_admin(): void
    {
        $deck = Deck::factory()->create();

        $this->patchJson(route('api.admin.decks.update', $deck), [])->assertStatus(401);
        $this->deleteJson(route('api.admin.decks.destroy', $deck))->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.decks.update', $deck), [])->assertForbidden();
        $this->deleteJson(route('api.admin.decks.destroy', $deck))->assertForbidden();
    }
}
