<?php

namespace Tests\Feature\Cards;

use App\Models\Block;
use App\Models\Card;
use App\Models\Deck;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CardApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_lists_cards_of_a_deck(): void
    {
        $deck = Deck::factory()->withCards(2)->create();

        $this->getJson(route('api.decks.cards.index', $deck))
            ->assertStatus(200)
            ->assertJsonCount(2);
    }

    public function test_show_returns_a_single_card_with_its_sides(): void
    {
        $card = Card::factory()->create();

        $this->getJson(route('api.cards.show', $card))
            ->assertStatus(200)
            ->assertJsonPath('id', $card->id)
            ->assertJsonPath('recto.body', ' recto ')
            ->assertJsonPath('verso.body', ' verso ')
            ->assertJsonPath('reference', null);
    }

    public function test_admin_can_store_a_default_card_with_two_blocks(): void
    {
        $this->actingAsAdmin();
        $deck = Deck::factory()->create();

        $this->postJson(route('api.admin.decks.cards.store', $deck), [])
            ->assertStatus(201)
            ->assertJsonPath('recto.body', ' recto ')
            ->assertJsonPath('verso.body', ' verso ')
            ->assertJsonPath('reference', null);

        $this->assertSame(1, $deck->cards()->count());
    }

    public function test_admin_can_store_a_dynamic_card_referencing_a_block(): void
    {
        $this->actingAsAdmin();
        $deck = Deck::factory()->create();
        $block = Block::factory()->create();

        $this->postJson(route('api.admin.decks.cards.store', $deck), [
            'reference_block_id'       => $block->id,
            'reference_block_splitter' => '###',
        ])->assertStatus(201)
            ->assertJsonPath('recto', null)
            ->assertJsonPath('verso', null)
            ->assertJsonPath('reference.splitter', '###');
    }

    public function test_admin_can_update_recto_and_verso_bodies(): void
    {
        $this->actingAsAdmin();
        $card = Card::factory()->create();
        $recto = $card->blocks[0];
        $verso = $card->blocks[1];

        $this->patchJson(route('api.admin.cards.update', $card), [
            'blocks' => [
                'recto' => ['id' => $recto->id, 'body' => 'Nouveau recto'],
                'verso' => ['id' => $verso->id, 'body' => 'Nouveau verso'],
            ],
        ])->assertStatus(200)
            ->assertJsonPath('recto.body', 'Nouveau recto')
            ->assertJsonPath('verso.body', 'Nouveau verso');
    }

    public function test_admin_can_update_the_splitter_of_a_dynamic_card(): void
    {
        $this->actingAsAdmin();
        $block = Block::factory()->create();
        $card = Card::factory()->withReferenceBlock($block)->create();

        $this->patchJson(route('api.admin.cards.update', $card), [
            'splitter' => '---',
        ])->assertStatus(200)
            ->assertJsonPath('reference.splitter', '---');

        $this->assertSame('---', $card->fresh()->reference_block_splitter);
    }

    public function test_admin_can_delete_a_card(): void
    {
        $this->actingAsAdmin();
        $card = Card::factory()->create();

        $this->deleteJson(route('api.admin.cards.destroy', $card))
            ->assertStatus(204);

        $this->assertModelMissing($card);
    }

    public function test_fetch_endpoint_requires_a_verified_user(): void
    {
        // CardApiController::fetch s'appuie sur orderByRaw('FIELD(...)'), MySQL-only :
        // le happy-path n'est pas exécutable sous SQLite. On caractérise le garde-fou.
        $card = Card::factory()->create();

        $this->getJson(route('api.students.cards.show', $card->id))
            ->assertStatus(401);
    }

    public function test_store_update_and_destroy_require_admin(): void
    {
        $deck = Deck::factory()->create();
        $card = Card::factory()->forDeck($deck)->create();

        $this->postJson(route('api.admin.decks.cards.store', $deck), [])->assertStatus(401);
        $this->patchJson(route('api.admin.cards.update', $card), [])->assertStatus(401);
        $this->deleteJson(route('api.admin.cards.destroy', $card))->assertStatus(401);

        $this->actingAsUser();
        $this->postJson(route('api.admin.decks.cards.store', $deck), [])->assertForbidden();
        $this->patchJson(route('api.admin.cards.update', $card), [])->assertForbidden();
        $this->deleteJson(route('api.admin.cards.destroy', $card))->assertForbidden();
    }
}
