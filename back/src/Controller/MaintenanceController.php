<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use App\Repository\MaintenanceRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Maintenance;
use DateTime;

class MaintenanceController extends AbstractController
{
    #[Route('/api/maintenance/{id}', name: 'new_maintenance', methods: ['POST'])]
    public function updateMaintenance($id, Request $request, MaintenanceRepository $maintenanceRepository, EntityManagerInterface $entityManager): Response
    {
        $description = $request->request->get('description');
        $date = new DateTime();
        $maintenance = $maintenanceRepository->findOneBy(['IDcar' => $id]);
        if (!$maintenance)
        {
            $maintenance = new Maintenance();
            $maintenance->setIDcar($id);
            $maintenance->setDescription($description);
            $maintenance->setDate($date);
            $entityManager->persist($maintenance);
            $entityManager->flush();
            return new JsonResponse(['message' => 'Maintenance updated successfully'], JsonResponse::HTTP_CREATED);
        }
        else
        {
            $maintenance->setDescription($description);
            $maintenance->setDate($date);
            $entityManager->flush();
            return new JsonResponse(['message' => 'Maintenance updated successfully'], JsonResponse::HTTP_OK);
        }
    }

    #[Route('/api/maintenance/{id}', name: 'view_maintenance', methods: ['GET'])]
    public function getMaintenance($id, MaintenanceRepository $maintenanceRepository): Response
    {
        $maintenance = $maintenanceRepository->findBy(['IDcar' => $id]);
        return $this->json($maintenance, Response::HTTP_OK);
    }
}
