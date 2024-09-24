<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\CarRepository;
use App\Service\Paginator;

class CarouselController extends AbstractController
{
    #[Route('/api/carousel', name: 'api_carousel', methods: ['GET'])]
    public function carousel(Request $request, CarRepository $carRepository, Paginator $paginator): JsonResponse
    {
        $page = $request->query->getInt('page', 1);
        $limit = $this->getParameter('pagination_limit');

        $queryBuilder = $carRepository->createQueryBuilder('c')
            ->where('c.category = :category')
            ->setParameter('category', 'Luxe');
        
        $pagination = $paginator->paginate($queryBuilder->getQuery(), $page, $limit);

        return $this->json($pagination);
    }
}

