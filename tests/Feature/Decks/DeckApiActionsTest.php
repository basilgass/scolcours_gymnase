<?php

namespace Tests\Feature\Decks;

use App\Models\Card;
use App\Models\Chapter;
use App\Models\Deck;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeckApiActionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_reorder_cards(): void
    {
        $this->actingAsAdmin();
        $deck = Deck::factory()->create();
        $c1 = Card::factory()->forDeck($deck)->create(['order' => 0]);
        $c2 = Card::factory()->forDeck($deck)->create(['order' => 1]);

        $this->patchJson(route('api.admin.decks.cards.order', $deck), [
            'order' => [
                ['id' => $c1->id, 'order' => 1],
                ['id' => $c2->id, 'order' => 0],
            ],
        ])->assertStatus(204);

        $this->assertSame(1, $c1->fresh()->order);
        $this->assertSame(0, $c2->fresh()->order);
    }

    public function test_admin_can_update_the_chapter_and_gets_the_raw_id_back(): void
    {
        $this->actingAsAdmin();
        $deck = Deck::factory()->create();
        $chapter = Chapter::factory()->create();

        // updateChapter retourne le chapter_id brut (scalaire), pas une resource.
        $this->patchJson(route('api.admin.decks.chapter', $deck), [
            'chapter_id' => $chapter->id,
        ])->assertStatus(200)
            ->assertSee((string) $chapter->id, false);

        $this->assertSame($chapter->id, $deck->fresh()->chapter_id);
    }

    public function test_update_chapter_rejects_an_unknown_chapter(): void
    {
        $this->actingAsAdmin();
        $deck = Deck::factory()->create();

        $this->patchJson(route('api.admin.decks.chapter', $deck), [
            'chapter_id' => 99999,
        ])->assertStatus(422)->assertJsonValidationErrors(['chapter_id']);
    }

    public function test_admin_can_toggle_active(): void
    {
        $this->actingAsAdmin();
        $deck = Deck::factory()->create(['active' => true]);

        $this->patchJson(route('api.admin.decks.active', $deck), [
            'active' => false,
        ])->assertStatus(204);

        $this->assertFalse($deck->fresh()->active);
    }

    public function test_toggle_active_validates_the_boolean(): void
    {
        $this->actingAsAdmin();
        $deck = Deck::factory()->create();

        $this->patchJson(route('api.admin.decks.active', $deck), [
            'active' => 'maybe',
        ])->assertStatus(422)->assertJsonValidationErrors(['active']);
    }

    public function test_deck_actions_require_admin(): void
    {
        $deck = Deck::factory()->create();

        $this->patchJson(route('api.admin.decks.cards.order', $deck), ['order' => []])->assertStatus(401);
        $this->patchJson(route('api.admin.decks.chapter', $deck), [])->assertStatus(401);
        $this->patchJson(route('api.admin.decks.active', $deck), [])->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.decks.cards.order', $deck), ['order' => []])->assertForbidden();
        $this->patchJson(route('api.admin.decks.chapter', $deck), [])->assertForbidden();
        $this->patchJson(route('api.admin.decks.active', $deck), [])->assertForbidden();
    }
}
