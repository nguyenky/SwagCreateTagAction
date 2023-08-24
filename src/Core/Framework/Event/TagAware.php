<?php declare(strict_types=1);
namespace Swag\CreateTagAction\Core\Framework\Event;

use Shopware\Core\Framework\Event\FlowEventAware;
use Shopware\Core\System\Tag\TagEntity;

interface TagAware extends FlowEventAware
{
    public const TAG = 'tag';

    public const TAG_ID = 'tagId';

    public function getTag(): TagEntity;
}
