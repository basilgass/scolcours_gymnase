<?php

namespace App\Console\Commands;

use App\Models\Deck;
use App\Models\Widget;
use Illuminate\Console\Command;

class deckArbre extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'deck-arbre';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Génération d\'un deck sur les arbres.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
		// 1. Create a new Deck
        // 2. For each images in /public/images/arbre
        //      Create a card
        //      Recto side: add an illustration to the block and add the image.
        //      Verso side: extract the name from the filename.

        echo "DECK ARBRE\n";
        $deck = Deck::createOrFirst([
            "slug" => 'arbre-3m',
            "title" => "identification des arbres"
        ]);

        $widget = Widget::where('slug', 'image-widget')->first();
        echo "Widget ID: $widget->id\n";

        $count = 1;
        $files = glob(public_path('images/arbre/*'));
//        foreach (Storage::disk('public')->files('images/arbre') as $file) {
        foreach ($files as $file) {
            $filename = pathinfo($file, PATHINFO_FILENAME);
            $treeName = preg_replace('/^corrige_arbres _|_Image_\d{4}$/', "", $filename);

            $filepath = '@/images/arbre/'.$filename.'.jpg';

            // Create a card.
            $card = $deck->cards()->create([
                'order' => $count
            ]);
            $count++;

            // Add cards.
            $blocks = $card->blocks()->createMany(
                [
                    [
                        'title' => ' quel est cet arbre ? ',
                        'body' => ''
                    ],
                    ['body' => $treeName]
                ]
            );

            $block = $blocks->first();

            // Add illustration to the (first) block.
            $block->illustrations()->create([
                'code' => $filepath,
                'parameters' => '',
                'type' => '',
                'widget_id' => $widget->id
            ]);

        }
    }
}
