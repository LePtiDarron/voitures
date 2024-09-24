<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use App\Entity\User;
use Symfony\Component\String\Slugger\SluggerInterface;

class SignupController extends AbstractController
{
    #[Route('/api/signup', name: 'signup', methods: ['POST'])]
    public function signup(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $hasher, SluggerInterface $slugger): Response
    {
        $username = $request->request->get('username');
        $email = $request->request->get('email');
        $password = $request->request->get('password');
        $firstname = $request->request->get('firstname');
        $lastname = $request->request->get('lastname');
        $address = $request->request->get('address');
        $city = $request->request->get('city');
        $gender = $request->request->get('gender');
        $phone = $request->request->get('phone');

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

        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($hasher->hashPassword($user, $password));
        $user->setFirstname($firstname);
        $user->setLastname($lastname);
        $user->setAddress($address);
        $user->setCity($city);
        $user->setGender($gender);
        $user->setPhone($phone);
        $user->setProfilePicture($photo);

        $entityManager->persist($user);
        $entityManager->flush();

        return new Response("User created successfully", Response::HTTP_CREATED);
    }
}
