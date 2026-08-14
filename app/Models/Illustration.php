<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * App\Models\Illustration
 *
 * @property int $id
 * @property int $block_id
 * @property int $order
 * @property string|null $title
 * @property string|null $footer
 * @property string|null $css
 * @property int|null $widget_id
 * @property string $code
 * @property string|null $parameters
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read \App\Models\Block $block
 * @property-read \App\Models\Widget|null $widget
 * @method static \Database\Factories\IllustrationFactory factory($count = null, $state = [])
 * @method static Builder<static>|Illustration newModelQuery()
 * @method static Builder<static>|Illustration newQuery()
 * @method static Builder<static>|Illustration query()
 * @method static Builder<static>|Illustration whereBlockId($value)
 * @method static Builder<static>|Illustration whereCode($value)
 * @method static Builder<static>|Illustration whereCreatedAt($value)
 * @method static Builder<static>|Illustration whereCss($value)
 * @method static Builder<static>|Illustration whereFooter($value)
 * @method static Builder<static>|Illustration whereId($value)
 * @method static Builder<static>|Illustration whereOrder($value)
 * @method static Builder<static>|Illustration whereParameters($value)
 * @method static Builder<static>|Illustration whereTitle($value)
 * @method static Builder<static>|Illustration whereUpdatedAt($value)
 * @method static Builder<static>|Illustration whereWidgetId($value)
 * @mixin Eloquent
 */
class Illustration extends Model
{
	use HasFactory;

	protected $fillable = [
		"parameters",
		"code",
		"widget_id",
		"css",
		"title",
		"footer",
		"order",
		"block_id",
		"value",
		"type",
	];

	protected $with = ['widget'];

	public function block(): BelongsTo
	{
		return $this->belongsTo(Block::class);
	}

	public function widget(): BelongsTo
	{
		return $this->belongsTo(Widget::class);
	}
}
