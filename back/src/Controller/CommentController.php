<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\CommentRepository;
use App\Entity\Comment;
use DateTime;

class CommentController extends AbstractController
{
    #[Route('/api/comments/{id}', name: 'app_comment', methods: ['POST'])]
    public function createComment($id, Request $request, EntityManagerInterface $entityManager, Security $security): Response
    {
        $user = $security->getUser();
        if (!$user) {
            throw $this->createNotFoundException('User not found.');
        }
        $content = $request->request->get('content');
        $note = $request->request->get('note');
        $date = new DateTime();

        $comment = new Comment();
        $comment->setIDuser($user->getId());
        $comment->setIDcar($id);
        $comment->setContent($content);
        $comment->setNote($note);
        $comment->setDate($date);
        $comment->setUsername($user->getUsername());

        $entityManager->persist($comment);
        $entityManager->flush();

        return $this->json($comment, Response::HTTP_CREATED);
    }
    
    #[Route('/api/comments/{id}', name: 'view_comments', methods: ['GET'])]
    public function viewComments($id, Request $request, EntityManagerInterface $entityManager, CommentRepository $commentRepository): Response
    {
        $comments = $commentRepository->findBy(['IDcar' => $id]);
        return $this->json($comments, Response::HTTP_OK);
    }

    #[Route('/api/comments/{id}', name: 'delete_comment', methods: ['DELETE'])]
    public function deleteComments($id, EntityManagerInterface $entityManager, CommentRepository $commentRepository): Response
    {
        $comments = $commentRepository->find($id);
        $entityManager->remove($comments);
        $entityManager->flush();
        return $this->json($comments, Response::HTTP_OK);
    }
}
