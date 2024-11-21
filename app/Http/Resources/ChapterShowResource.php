<?php

namespace App\Http\Resources;

use App\Models\Chapter;
use Illuminate\Http\Request;

/**
 * @mixin Chapter
 */
class ChapterShowResource extends ChapterResource
{
    // No wrap around the data.
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        $data = parent::toArray($request);

        // Make sure the block exists !
        if (count($this->blocks) === 0) {
            $this->blocks()->create();
        }
        
        $data[ 'block' ] = BlockResource::make($this->blocks[ 0 ]);

        return $data;
    }
}
