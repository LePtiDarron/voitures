<?php

namespace App\Service;

use Doctrine\ORM\Query;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\Pagination\Paginator as DoctrinePaginator;

class Paginator
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function paginate(Query $query, int $page = 1, int $limit = 1): array
    {
        $paginator = new DoctrinePaginator($query);
        $totalItems = count($paginator);
        $pagesCount = ceil($totalItems / $limit);

        $query->setFirstResult(($page - 1) * $limit)
              ->setMaxResults($limit);

        $items = $query->getResult();

        return [
            'items' => $items,
            'total' => $totalItems,
            'pages' => $pagesCount,
            'current' => $page
        ];
    }
}
