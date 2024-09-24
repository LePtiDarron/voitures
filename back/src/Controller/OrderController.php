<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\InventoryRepository;
use App\Repository\OrderRepository;
use App\Entity\Availability;
use DateTimeInterface;
use App\Entity\Order;
use DateTime;

class OrderController extends AbstractController
{
    #[Route('/api/rent', name: 'create_order_rent', methods: ['POST'])]
    public function rentCar(Request $request, EntityManagerInterface $entityManager, ValidatorInterface $validator, InventoryRepository $inventoryRepository, Security $security): Response
    {
        $user = $security->getUser();
        if (!$user) {
            return new JsonResponse(['message' => 'Unauthorized'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $IDcar = $request->request->get('IDcar');
        $date = $request->request->get('date');
        $price = $request->request->get('price');
        $startDate = $request->request->get('startDate');
        $endDate = $request->request->get('endDate');

        $inventory = $inventoryRepository->findOneBy(['IDcar' => $IDcar]);
        if (!$inventory) {
            return new JsonResponse(['message' => 'Inventory not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $order = new Order();
        $order->setIDcar($IDcar);
        $order->setType('rent');
        $order->setDate(new \DateTime($date));
        $order->setPrice($price);
        $order->setStartDate(new \DateTime($startDate));
        $order->setEndDate(new \DateTime($endDate));
        $order->setIDuser($user->getId());

        $errors = $validator->validate($order);
        if (count($errors) > 0) {
            return new JsonResponse(['errors' => (string) $errors], JsonResponse::HTTP_BAD_REQUEST);
        }

        $inventory = $inventoryRepository->findOneBy(['IDcar' => $IDcar]);
        if (!$inventory) {
            return new JsonResponse(['message' => 'Inventory not found'], JsonResponse::HTTP_NOT_FOUND);
        }
        if ($inventory) {
            $availability = new Availability();
            $availability->setStartDate(new \DateTime($startDate));
            $availability->setEndDate(new \DateTime($endDate));
            $availability->setInventory($inventory);
            $entityManager->persist($availability);
        }
        
        $entityManager->persist($order);
        $entityManager->flush();
        
        return new JsonResponse(['message' => 'Order created successfully'], JsonResponse::HTTP_CREATED);
    }

    #[Route('/api/buy', name: 'create_order_buy', methods: ['POST'])]
    public function buyCar(Request $request, EntityManagerInterface $entityManager, ValidatorInterface $validator, InventoryRepository $inventoryRepository, Security $security): Response
    {
        $user = $security->getUser();
        if (!$user) {
            return new JsonResponse(['message' => 'Unauthorized'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $IDcar = $request->request->get('IDcar');
        $date = $request->request->get('date');
        $price = $request->request->get('price');
        $startDate = $request->request->get('startDate');
        $endDate = $request->request->get('endDate');
        
        $inventory = $inventoryRepository->findOneBy(['IDcar' => $IDcar]);
        if (!$inventory) {
            return new JsonResponse(['message' => 'Inventory not found'], JsonResponse::HTTP_NOT_FOUND);
        }
        if ($inventory->getQuantity() <= 0) {
            return new JsonResponse(['message' => 'No inventory available'], JsonResponse::HTTP_BAD_REQUEST);
        }
        $inventory->setQuantity($inventory->getQuantity() - 1);
        $entityManager->persist($inventory);
        
        $order = new Order();
        $order->setIDcar($IDcar);
        $order->setType('buy');
        $order->setDate(new \DateTime($date));
        $order->setPrice($price);
        $order->setStartDate(new \DateTime($date));
        $order->setEndDate(new \DateTime($date));
        $order->setIDuser($user->getId());

        $errors = $validator->validate($order);
        if (count($errors) > 0) {
            return new JsonResponse(['errors' => (string) $errors], JsonResponse::HTTP_BAD_REQUEST);
        }
        
        $entityManager->persist($order);
        $entityManager->flush();
        
        return new JsonResponse(['message' => 'Order created successfully'], JsonResponse::HTTP_CREATED);
    }

    #[Route('/api/orders/{id}', name: 'get_single_order', methods: ['GET'])]
    public function getOrder(int $id, OrderRepository $orderRepository): Response
    {
        $order = $orderRepository->find($id);

        if (!$order) {
            return new JsonResponse(['error' => 'Order not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        return $this->json($order);
    }

    #[Route('/api/orders/', name: 'get_order', methods: ['GET'])]
    public function getOrders(OrderRepository $orderRepository, Security $security): Response
    {
        $user = $security->getUser();
        $orders = $orderRepository->findBy(['IDuser' => $user->getID()]);
        return $this->json($orders, Response::HTTP_OK);
    }

    #[Route('/api/orders/{id}', name: 'delete_order', methods: ['DELETE'])]
    public function deleteOrder(int $id, OrderRepository $orderRepository, EntityManagerInterface $entityManager): Response
    {
        $order = $orderRepository->find($id);

        if (!$order) {
            return new JsonResponse(['error' => 'Order not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $entityManager->remove($order);
        $entityManager->flush();
        
        return new JsonResponse(['message' => 'Order deleted successfully'], JsonResponse::HTTP_NO_CONTENT);
    }
}
