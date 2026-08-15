<?php

namespace App\Services\Seo;

enum MetaSource: string
{
    case Override = 'override';
    case Block = 'block';
    case Body = 'body';
    case Template = 'template';
}
