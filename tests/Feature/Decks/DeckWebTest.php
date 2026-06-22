<?php

namespace Tests\Feature\Decks;

use App\Models\Deck;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DeckWebTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_is_public_and_lists_only_active_decks(): void
    {
        Deck::factory()->create(['title' => 'Actif']);
        Deck::factory()->inactive()->create(['title' => 'Inactif']);

        $this->get(route('decks.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Decks/DeckIndex')
                ->has('decks', 1));
    }

    public function test_show_is_public_and_creates_no_score_for_a_guest(): void
    {
        $deck = Deck::factory()->withCards(2)->create();

        $this->get(route('decks.show', $deck))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Decks/DeckShow')
                ->where('deck.id', $deck->id));

        $this->assertSame(0, $deck->scores()->count());
    }

    public function test_show_bootstraps_scores_for_an_authenticated_user(): void
    {
        $this->actingAsUser();
        $deck = Deck::factory()->withCards(2)->create();

        $this->get(route('decks.show', $deck))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page->component('Decks/DeckShow'));

        // Un score pour le deck + un score par carte.
        $this->assertSame(1, $deck->scores()->count());
        foreach ($deck->cards as $card) {
            $this->assertSame(1, $card->scores()->count());
        }
    }

    public function test_portfolio_is_public(): void
    {
        $deck = Deck::factory()->create();

        $this->get(route('decks.portfolio', $deck))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Decks/DeckPortfolio')
                ->where('deck.id', $deck->id));
    }

    public function test_dashboard_is_restricted_to_admins(): void
    {
        $this->get(route('admin.decks.index'))->assertRedirect();

        $this->actingAsUser();
        $this->get(route('admin.decks.index'))->assertForbidden();
    }

    public function test_admin_can_open_the_dashboard(): void
    {
        $this->actingAsAdmin();
        Deck::factory()->count(2)->create();

        $this->get(route('admin.decks.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Decks/admin/AdminDeck')
                ->has('decks', 2));
    }

    public function test_edit_is_restricted_to_admins(): void
    {
        $deck = Deck::factory()->create();

        $this->get(route('admin.decks.edit', $deck))->assertRedirect();

        $this->actingAsUser();
        $this->get(route('admin.decks.edit', $deck))->assertForbidden();
    }

    public function test_admin_can_open_the_edit_page(): void
    {
        $this->actingAsAdmin();
        $deck = Deck::factory()->withCards(1)->create();

        $this->get(route('admin.decks.edit', $deck))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Decks/DeckEdit')
                ->where('deck.id', $deck->id));
    }
}
