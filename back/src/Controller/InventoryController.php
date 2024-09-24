<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\InventoryRepository;
use App\Entity\Inventory;

class InventoryController extends AbstractController
{
    #[Route('/api/inventory/{id}', name: 'new_inventory', methods: ['POST'])]
    public function updateInventory($id, Request $request, InventoryRepository $inventoryRepository, EntityManagerInterface $entityManager): Response
    {
        $quantity = $request->request->get('quantity');
        $inventory = $inventoryRepository->findOneBy(['IDcar' => $id]);
        if (!$inventory)
        {
            $inventory = new Inventory();
            $inventory->setIDcar($id);
            $inventory->setQuantity($quantity);
            $entityManager->persist($inventory);
            $entityManager->flush();
            return new JsonResponse(['message' => 'Inventory updated successfully'], JsonResponse::HTTP_CREATED);
        }
        else
        {
            $inventory->setIDcar($id);
            $inventory->setQuantity($quantity);
            $entityManager->flush();
            return new JsonResponse(['message' => 'Inventory updated successfully'], JsonResponse::HTTP_OK);
        }
    }

    #[Route('/api/inventory/{id}', name: 'view_inventory', methods: ['GET'])]
    public function getInventory($id, InventoryRepository $inventoryRepository): Response
    {
        $inventory = $inventoryRepository->findOneBy(['IDcar' => $id]);

        if (!$inventory) {
            return new JsonResponse(['error' => 'Inventory not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $availabilities = $inventory->getAvailabilities()->map(function($availability) {
            return [
                'startDate' => $availability->getStartDate()->format('Y-m-d'),
                'endDate' => $availability->getEndDate()->format('Y-m-d'),
            ];
        })->toArray();

        $data = [
            'quantity' => $inventory->getQuantity(),
            'availability' => $availabilities,
        ];

        return $this->json($data, Response::HTTP_OK);
    }
}
