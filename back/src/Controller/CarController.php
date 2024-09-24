<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\CarRepository;
use App\Service\Paginator;
use App\Entity\Inventory;
use App\Entity\Car;

class CarController extends AbstractController
{
    #[Route('/api/cars', name: 'view_car', methods: ['GET'])]
    public function getCars(CarRepository $carRepository, Request $request, Paginator $paginator): JsonResponse
    {
        $page = $request->query->getInt('page', 1);
        $limit = $this->getParameter('pagination_limit');
        $query = $carRepository->createQueryBuilder('c')->getQuery();
        $pagination = $paginator->paginate($query, $page, $limit);
        return $this->json($pagination);
    }

    #[Route('/api/cars/sell', name: 'view_car_selling', methods: ['GET'])]
    public function getCarsSelling(CarRepository $carRepository, Request $request, Paginator $paginator, EntityManagerInterface $entityManager): JsonResponse
    {
        $page = $request->query->getInt('page', 1);
        $limit = $this->getParameter('pagination_limit');

        $query = $entityManager->getRepository(Car::class)
            ->createQueryBuilder('c')
            ->where('c.location = :location')
            ->setParameter('location', 0)
            ->getQuery();

        $pagination = $paginator->paginate($query, $page, $limit);

        return $this->json($pagination);
    }

    #[Route('/api/cars/location', name: 'view_car_location', methods: ['GET'])]
    public function getCarsLocation(CarRepository $carRepository, Request $request, Paginator $paginator, EntityManagerInterface $entityManager): JsonResponse
    {
        $page = $request->query->getInt('page', 1);
        $limit = $this->getParameter('pagination_limit');

        $query = $entityManager->getRepository(Car::class)
            ->createQueryBuilder('c')
            ->where('c.location = :location')
            ->setParameter('location', 1)
            ->getQuery();

        $pagination = $paginator->paginate($query, $page, $limit);

        return $this->json($pagination);
    }
    
    #[Route('/api/cars', name: 'create_car', methods: ['POST'])]
    public function createCar(Request $request, EntityManagerInterface $entityManager, SluggerInterface $slugger): Response
    {
        $brand = $request->request->get('brand');
        $color = $request->request->get('color');
        $year = $request->request->get('year');
        $type = $request->request->get('type');
        $power = $request->request->get('power');
        $fuel = $request->request->get('fuel');
        $gearBox = $request->request->get('gearBox');
        $mileage = $request->request->get('mileage');
        $model = $request->request->get('model');
        $description = $request->request->get('description');
        $price = $request->request->get('price');
        $places = $request->request->get('places');
        $doors = $request->request->get('doors');
        $category = $request->request->get('category');
        $location = $request->request->get('location') === 'true';

        $pictures = $request->files->get('pictures');
        $pictureUrls = [];

        if ($pictures) {
            foreach ($pictures as $picture) {
                $originalFilename = pathinfo($picture->getClientOriginalName(), PATHINFO_FILENAME);
                $safeFilename = $slugger->slug($originalFilename);
                $newFilename = $safeFilename.'-'.uniqid().'.'.$picture->guessExtension();

                try {
                    $picture->move(
                        $this->getParameter('car_pictures_directory'),
                        $newFilename
                    );
                    $pictureUrls[] = $newFilename;
                } catch (FileException $e) {
                    return new Response("Failed to upload file: " . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
                }
            }
        }

        $car = new Car();
        $car->setBrand($brand);
        $car->setColor($color);
        $car->setYear($year);
        $car->setType($type);
        $car->setPower($power);
        $car->setFuel($fuel);
        $car->setGearBox($gearBox);
        $car->setMileage($mileage);
        $car->setModel($model);
        $car->setDescription($description);
        $car->setPrice($price);
        $car->setPlaces($places);
        $car->setDoors($doors);
        $car->setCategory($category);
        $car->setPictures($pictureUrls);
        $car->setLocation($location);

        $entityManager->persist($car);
        $entityManager->flush();

        $inventory = new Inventory();
        $inventory->setIDcar($car->getId());
        $inventory->setQuantity(1);

        $entityManager->persist($inventory);
        $entityManager->flush();

        return new Response("Car created successfully", Response::HTTP_CREATED);
    }

    #[Route('/api/cars/{id}', name: 'car_details', methods: ['GET'])]
    public function carDetails($id, CarRepository $carRepository): JsonResponse
    {
        $car = $carRepository->find($id);

        if (!$car) {
            throw $this->createNotFoundException('Car not found.');
        }

        return $this->json($car);
    }

    #[Route('/api/cars/{id}', name: 'cars_delete', methods: ['DELETE'])]
    public function deleteCar($id, CarRepository $carRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $car = $carRepository->find($id);

        if (!$car) {
            throw $this->createNotFoundException('Car not found.');
        }

        $entityManager->remove($car);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Car deleted successfully'], JsonResponse::HTTP_OK);
    }
}
