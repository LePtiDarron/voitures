<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\CarRepository;
use App\Service\Paginator;

class SearchController extends AbstractController
{
    #[Route('/api/search', name: 'api_search', methods: ['GET'])]
    public function search(Request $request, CarRepository $carRepository, Paginator $paginator): JsonResponse
    {
        $query = $request->query->get('query', '');
        $page = $request->query->getInt('page', 1);
        $limit = $this->getParameter('pagination_limit');

        if (empty($query)) {
            return new JsonResponse([], JsonResponse::HTTP_OK);
        }

        $brand = $request->query->get('brand');
        $year = $request->query->get('year');
        $type = $request->query->get('type');
        $fuel = $request->query->get('fuel');
        $gearBox = $request->query->get('gearBox');
        $priceMin = $request->query->get('priceMin');
        $priceMax = $request->query->get('priceMax');
        $mileageMax = $request->query->get('mileageMax');
        $transactionType = $request->query->get('transactionType');

        $queryBuilder = $carRepository->createQueryBuilder('c')
            ->where('c.brand LIKE :query')
            ->orWhere('c.model LIKE :query')
            ->setParameter('query', '%' . $query . '%');

        if ($brand) {
            $queryBuilder->andWhere('c.brand = :brand')->setParameter('brand', $brand);
        }
        if ($year) {
            $queryBuilder->andWhere('c.year = :year')->setParameter('year', $year);
        }
        if ($type) {
            $queryBuilder->andWhere('c.type = :type')->setParameter('type', $type);
        }
        if ($fuel) {
            $queryBuilder->andWhere('c.fuel = :fuel')->setParameter('fuel', $fuel);
        }
        if ($gearBox) {
            $queryBuilder->andWhere('c.gearBox = :gearBox')->setParameter('gearBox', $gearBox);
        }
        if ($priceMin) {
            $queryBuilder->andWhere('c.price >= :priceMin')->setParameter('priceMin', $priceMin);
        }
        if ($priceMax) {
            $queryBuilder->andWhere('c.price <= :priceMax')->setParameter('priceMax', $priceMax);
        }
        if ($mileageMax) {
            $queryBuilder->andWhere('c.mileage <= :mileageMax')->setParameter('mileageMax', $mileageMax);
        }
        if ($transactionType !== null) {
            $queryBuilder->andWhere('c.location = :transactionType')->setParameter('transactionType', $transactionType === 'location' ? 1 : 0);
        }
        $pagination = $paginator->paginate($queryBuilder->getQuery(), $page, $limit);

        return $this->json($pagination);
    }
}
