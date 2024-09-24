<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Doctrine\ORM\EntityManagerInterface;

class MyUserController extends AbstractController
{
    #[Route('/api/users', name: 'user_info', methods: ['GET'])]
    public function userInfo(Security $security): JsonResponse
    {
        $user = $security->getUser();
        if (!$user) {
            throw $this->createNotFoundException('User not found.');
        }
        $userData = [
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'email' => $user->getEmail(),
            'address' => $user->getAddress(),
            'city' => $user->getCity(),
            'phone' => $user->getPhone(),
            'gender' => $user->getGender(),
            'profilePicture' => $user->getProfilePicture(),
            'roles' => $user->getRoles(),
        ];
        return $this->json($userData);
    }

    #[Route('/api/users', name: 'update_user', methods: ['PUT'])]
    public function updateUser(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            throw $this->createNotFoundException('User not found.');
        }
        
        $requestData = json_decode($request->getContent(), true);

        $user->setFirstName($requestData['firstName'] ?? $user->getFirstName());
        $user->setLastName($requestData['lastName'] ?? $user->getLastName());
        $user->setPhone($requestData['phone'] ?? $user->getPhone());
        $user->setAddress($requestData['address'] ?? $user->getAddress());
        $user->setCity($requestData['city'] ?? $user->getCity());
        $entityManager->flush();

        return new JsonResponse(['message' => 'User updated successfully'], JsonResponse::HTTP_OK);
    }

    #[Route('/api/users/picture', name: 'update_user_photo', methods: ['POST'])]
    public function updateUserPicture(Request $request, EntityManagerInterface $entityManager, SluggerInterface $slugger): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            throw $this->createNotFoundException('User not found.');
        }
        
        $profilePicture = $request->files->get('profilePicture');

        if ($profilePicture) {
            $originalFilename = pathinfo($profilePicture->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = $slugger->slug($originalFilename);
            $newFilename = $safeFilename.'-'.uniqid().'.'.$profilePicture->guessExtension();
            try {
                $profilePicture->move(
                    $this->getParameter('profile_pictures_directory'),
                    $newFilename
                );
            } catch (FileException $e) {}
            $photo = $newFilename;
        } else {
            $photo = '';
        }

        $user->setProfilePicture($photo);

        $entityManager->flush();

        return new JsonResponse(['message' => 'User updated successfully'], JsonResponse::HTTP_OK);
    }

    #[Route('/api/users', name: 'delete_user', methods: ['DELETE'])]
    public function deleteUser(EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            throw $this->createNotFoundException('User not found.');
        }

        $entityManager->remove($user);
        $entityManager->flush();

        return new JsonResponse(['message' => 'User deleted successfully'], JsonResponse::HTTP_OK);
    }
}
